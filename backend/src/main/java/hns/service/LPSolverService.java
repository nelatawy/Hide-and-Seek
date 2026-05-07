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
    public SolverResult solveHider(List<List<Double>> payoffMatrix) {
        int k = findShift(payoffMatrix);
        List<List<Double>> shiftedPayoff = shiftMatrix(payoffMatrix, k);
        List<List<Double>> T = transpose(shiftedPayoff); // rows become the seeker's perspective
        int n = T.get(0).size(); // number of hider spots (decision variables)

        // Objective: minimize x1 + x2 + ... + xn  →  all coefficients = 1.0
        List<Double> objective = new ArrayList<>(Collections.nCopies(n, 1.0));

        // Each row of the transposed matrix gives one GE constraint (>= 1)
        List<List<Double>> constraints = new ArrayList<>(T);
        List<Double> rhs = new ArrayList<>(Collections.nCopies(T.size(), 1.0));

        LpProblem problem = new LpProblem();
        problem.setMethod(SolverMethod.TWO_PHASE);
        problem.setMaximization(false);
        problem.setObjectiveCoefficients(objective);
        problem.setConstraintCoefficients(constraints);
        problem.setConstraintTypes(new ArrayList<>(Collections.nCopies(constraints.size(), ConstraintType.GE)));
        problem.setRhsValues(rhs);
        problem.setUnrestrictedVariables(new ArrayList<>());

        SolverResult result = solverService.solve(problem);

        result.setVariableValues(normaliseToProbabilities(result.getVariableValues(), n));
        result.setOptimalValue(normaliseGameValue(result.getOptimalValue(), k));
        return result;
    }

    // Shift matrix, use rows as-is, build LE LP (Maximize Σyⱼ), solve with SIMPLEX, normalize → seeker probabilities
    public SolverResult solveSeeker(List<List<Double>> payoffMatrix) {
        int k = findShift(payoffMatrix);
        List<List<Double>> shiftedPayoff = shiftMatrix(payoffMatrix, k);
        int n = shiftedPayoff.get(0).size(); // number of seeker spots (decision variables)

        // Objective: maximize y1 + y2 + ... + yn  →  all coefficients = 1.0
        List<Double> objective = new ArrayList<>(Collections.nCopies(n, 1.0));

        // Each ROW of the matrix gives one LE constraint (≤ 1)
        List<List<Double>> constraints = new ArrayList<>(shiftedPayoff);
        List<Double> rhs = new ArrayList<>(Collections.nCopies(shiftedPayoff.size(), 1.0));

        LpProblem problem = new LpProblem();
        problem.setMethod(SolverMethod.SIMPLEX);
        problem.setMaximization(true);
        problem.setObjectiveCoefficients(objective);
        problem.setConstraintCoefficients(constraints);
        problem.setConstraintTypes(new ArrayList<>(Collections.nCopies(constraints.size(), ConstraintType.LE)));
        problem.setRhsValues(rhs);
        problem.setUnrestrictedVariables(new ArrayList<>());

        SolverResult result = solverService.solve(problem);
        result.setVariableValues(normaliseToProbabilities(result.getVariableValues(), n));
        result.setOptimalValue(normaliseGameValue(result.getOptimalValue(), k));
        return result;
    }

    public double normaliseGameValue(double value, int shift) {
        double V_shifted = 1.0 / value;
        double V = V_shifted - shift;
        return V;
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
    private int findShift(List<List<Double>> matrix) {
        double minVal = Double.MAX_VALUE;
        for (List<Double> row : matrix)
            minVal = Math.min(minVal, Collections.min(row));
        return (minVal <= 0) ? (int) Math.abs(minVal) + 1 : 0;
    }

    // shifted[i][j] = matrix[i][j] + k
    private List<List<Double>> shiftMatrix(List<List<Double>> matrix, int k) {
        List<List<Double>> newMatrix = new ArrayList<>();
        for (List<Double> row : matrix) {
            List<Double> newRow = new ArrayList<>(row);
            newRow.replaceAll(e -> e + k);
            newMatrix.add(newRow);
        }
        return newMatrix;
    }

    // probs[i] = variableValues[i] / sum(variableValues[0..n-1])
    // Uses only the first n values to exclude slack/artificial variables added by the solver
    private List<Double> normaliseToProbabilities(List<Double> variableValues, int n) {
        List<Double> vars = variableValues.subList(0, n);
        double sum = vars.stream().mapToDouble(Double::doubleValue).sum();
        return vars.stream().map(v -> v / sum).collect(Collectors.toList());
    }
}
