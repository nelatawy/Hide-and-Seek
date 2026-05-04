package hns.solver;

import hns.solver.model.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class SolverService {

    private final SimplexSolver simplexSolver;

    public SolverService(SimplexSolver simplexSolver) {
        this.simplexSolver = simplexSolver;
    }

    public SolverResult solve(LpProblem problem) {
        SolverMethod method = problem.getMethod();
        List<List<Double>> constraints = problem.getConstraintCoefficients();
        List<ConstraintType> types = problem.getConstraintTypes();
        List<Double> objectiveCoefficients = problem.getObjectiveCoefficients();
        List<Integer> unrestricted = problem.getUnrestrictedVariables();
        int originalSize = objectiveCoefficients.size();

        List<AddedVarType> addedVars = standardize(constraints, objectiveCoefficients, types);

        List<String> headers = new ArrayList<>();
        setInitialHeaders(headers, addedVars, originalSize);
        int addedFromSplit = splitVars(constraints, objectiveCoefficients, unrestricted, headers);

        List<List<Double>> initTable = tableOf(problem);
        List<Integer> basis = getBases(addedVars, originalSize + addedFromSplit);

        Tableau initialTableau = new Tableau(0, basis, addedVars, initTable, -1, -1, "Initial Tableau", headers);

        if (method == SolverMethod.SIMPLEX) {
            List<Double> zRow = simplexSolver.computeZRow(objectiveCoefficients, basis, initTable);
            initTable.add(zRow);
            return simplexSolver.simplex(initialTableau, problem.isMaximization());
        } else {
            return simplexSolver.twoPhase(objectiveCoefficients, initialTableau, problem.isMaximization());
        }
    }

    private int splitVars(List<List<Double>> constraints, List<Double> objective,
                          List<Integer> unrestricted, List<String> headers) {
        int offset = 0;
        for (int i : unrestricted) {
            String toBeSplit = headers.get(i + offset);
            headers.set(i + offset, toBeSplit + "_+");
            headers.add(i + 1 + offset, toBeSplit + "_-");
            for (List<Double> currConstraint : constraints) {
                double coef = currConstraint.get(i + offset);
                currConstraint.add(i + offset + 1, -1.0 * coef);
            }
            objective.add(i + offset + 1, -1.0 * objective.get(i + offset));
            offset++;
        }
        return offset;
    }

    private List<AddedVarType> standardize(List<List<Double>> constraints,
                                           List<Double> objectiveCoefficients,
                                           List<ConstraintType> types) {
        List<AddedVarType> added = new ArrayList<>();
        for (int i = 0; i < types.size(); i++) {
            ConstraintType currType = types.get(i);
            for (int j = 0; j < constraints.size(); j++) {
                if (j == i) {
                    if (currType == ConstraintType.LE) {
                        constraints.get(j).add(1.0);
                        added.add(AddedVarType.SLACK);
                        objectiveCoefficients.add(0.0);
                    } else if (currType == ConstraintType.EQ) {
                        constraints.get(j).add(1.0);
                        added.add(AddedVarType.ARTIFICIAL);
                        objectiveCoefficients.add(0.0);
                    } else {
                        constraints.get(j).addAll(List.of(-1.0, 1.0));
                        added.addAll(List.of(AddedVarType.EXCESS, AddedVarType.ARTIFICIAL));
                        objectiveCoefficients.addAll(List.of(0.0, 0.0));
                    }
                } else {
                    constraints.get(j).add(0.0);
                    if (currType == ConstraintType.GE) constraints.get(j).add(0.0);
                }
            }
        }
        return added;
    }

    private List<List<Double>> tableOf(LpProblem problem) {
        List<List<Double>> table = new ArrayList<>();
        List<List<Double>> constraints = problem.getConstraintCoefficients();
        List<Double> rhs = problem.getRhsValues();
        for (int i = 0; i < rhs.size(); i++) {
            List<Double> row = new ArrayList<>(constraints.get(i));
            row.add(rhs.get(i));
            table.add(row);
        }
        return table;
    }

    private List<Integer> getBases(List<AddedVarType> addedVars, int offset) {
        List<Integer> baseIndices = new ArrayList<>();
        for (int i = 0; i < addedVars.size(); i++)
            if (addedVars.get(i) == AddedVarType.ARTIFICIAL || addedVars.get(i) == AddedVarType.SLACK)
                baseIndices.add(i + offset);
        return baseIndices;
    }

    private void setInitialHeaders(List<String> headers, List<AddedVarType> addedVars, int numberOfVars) {
        for (int i = 0; i < numberOfVars; i++) headers.add("x" + (i + 1));
        for (int i = 0; i < addedVars.size(); i++) {
            switch (addedVars.get(i)) {
                case SLACK      -> headers.add("s" + (i + 1));
                case EXCESS     -> headers.add("e" + (i + 1));
                case ARTIFICIAL -> {
                    if (i > 0 && addedVars.get(i - 1) == AddedVarType.EXCESS) headers.add("a" + i);
                    else headers.add("a" + i);
                }
            }
        }
    }
}
