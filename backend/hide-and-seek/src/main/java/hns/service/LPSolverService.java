package hns.service;

import hns.solver.SolverService;
import hns.solver.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LPSolverService {

    private final SolverService solverService;

    public LPSolverService(SolverService solverService) {
        this.solverService = solverService;
    }

    // Shift matrix, transpose it, build GE LP (Minimize Σxᵢ), solve with TWO_PHASE, normalize → hider probabilities
    public List<Double> solveHider(List<List<Integer>> payoffMatrix) {
        int k = findShift(payoffMatrix);
        shiftMatrix(payoffMatrix, k);
        List<List<Integer>> T = transpose(payoffMatrix); // rows become the seeker's perspective
        int n = T.get(0).size(); // number of hider spots (decision variables)

        // Objective: minimize x1 + x2 + ... + xn  →  all coefficients = 1.0
        List<Double> objective = new ArrayList<>(Collections.nCopies(n, 1.0));

        // Each row of the transposed matrix gives one GE constraint (>= 1)
        List<List<Double>> constraints = new ArrayList<>();
        List<Double> rhs = new ArrayList<>();
        for (List<Integer> row : T) {
            constraints.add(row.stream().map(Integer::doubleValue).collect(Collectors.toList()));
            rhs.add(1.0);
        }

        LpProblem problem = new LpProblem();
        problem.setMethod(SolverMethod.TWO_PHASE);
        problem.setMaximization(false);
        problem.setObjectiveCoefficients(objective);
        problem.setConstraintCoefficients(constraints);
        problem.setConstraintTypes(new ArrayList<>(Collections.nCopies(constraints.size(), ConstraintType.GE)));
        problem.setRhsValues(rhs);
        problem.setUnrestrictedVariables(new ArrayList<>());

        SolverResult result = solverService.solve(problem);
        return normaliseToProbabilities(result.getVariableValues(), n);
    }

    // Shift matrix, use rows as-is, build LE LP (Maximize Σyⱼ), solve with SIMPLEX, normalize → seeker probabilities
    public List<Double> solveSeeker(List<List<Integer>> payoffMatrix) {
        int k = findShift(payoffMatrix);
        shiftMatrix(payoffMatrix, k);
        int n = payoffMatrix.get(0).size(); // number of seeker spots (decision variables)

        // Objective: maximize y1 + y2 + ... + yn  →  all coefficients = 1.0
        List<Double> objective = new ArrayList<>(Collections.nCopies(n, 1.0));

        // Each ROW of the matrix gives one LE constraint (≤ 1)
        List<List<Double>> constraints = new ArrayList<>();
        List<Double> rhs = new ArrayList<>();
        for (List<Integer> row : payoffMatrix) {
            constraints.add(row.stream().map(Integer::doubleValue).collect(Collectors.toList()));
            rhs.add(1.0);
        }

        LpProblem problem = new LpProblem();
        problem.setMethod(SolverMethod.SIMPLEX);
        problem.setMaximization(true);
        problem.setObjectiveCoefficients(objective);
        problem.setConstraintCoefficients(constraints);
        problem.setConstraintTypes(new ArrayList<>(Collections.nCopies(constraints.size(), ConstraintType.LE)));
        problem.setRhsValues(rhs);
        problem.setUnrestrictedVariables(new ArrayList<>());

        SolverResult result = solverService.solve(problem);
        return normaliseToProbabilities(result.getVariableValues(), n);
    }

    // v = Σᵢ Σⱼ hiderStrategy[i] * seekerStrategy[j] * payoffMatrix[i][j]
    public double computeGameValue(List<List<Integer>> payoffMatrix, List<Double> hiderStrategy, List<Double> seekerStrategy) {
        double value = 0.0;
        for (int i = 0; i < hiderStrategy.size(); i++)
            for (int j = 0; j < seekerStrategy.size(); j++)
                value += hiderStrategy.get(i) * seekerStrategy.get(j) * payoffMatrix.get(i).get(j);
        return value;
    }

    // transposes the matrix
    public static <T> List<List<T>> transpose(List<List<T>> matrix) {
        List<List<T>> result = new ArrayList<>();
        final int cols = matrix.get(0).size();
        for (int i = 0; i < cols; i++) {
            List<T> col = new ArrayList<>();
            for (List<T> row : matrix)
                col.add(row.get(i));
            result.add(col);
        }
        return result;
    }

    // k = |min value in matrix| + 1  (0 if all values already positive)
    private int findShift(List<List<Integer>> matrix) {
        int minVal = Integer.MAX_VALUE;
        for (List<Integer> row : matrix)
            minVal = Math.min(minVal, Collections.min(row));
        return (minVal < 0) ? Math.abs(minVal) + 1 : 0;
    }

    // shifted[i][j] = matrix[i][j] + k  (in-place)
    private void shiftMatrix(List<List<Integer>> matrix, int k) {
        matrix.forEach(row -> row.replaceAll(e -> e + k));
    }

    // probs[i] = variableValues[i] / sum(variableValues[0..n-1])
    // Uses only the first n values to exclude slack/artificial variables added by the solver
    private List<Double> normaliseToProbabilities(List<Double> variableValues, int n) {
        List<Double> vars = variableValues.subList(0, n);
        double sum = vars.stream().mapToDouble(Double::doubleValue).sum();
        return vars.stream().map(v -> v / sum).collect(Collectors.toList());
    }
}
