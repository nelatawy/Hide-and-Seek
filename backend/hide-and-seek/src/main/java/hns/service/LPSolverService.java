package hns.service;

import hns.solver.SolverService;
import hns.solver.model.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LPSolverService {

    private final SolverService solverService;

    public LPSolverService(SolverService solverService) {
        this.solverService = solverService;
    }

    // Shift matrix, transpose it, build GE LP (Minimize Σxᵢ), solve with TWO_PHASE, normalise → hider probabilities
    public double[] solveHider(int[][] payoffMatrix) {
        throw new UnsupportedOperationException("TODO");
    }

    // Shift matrix, use rows as-is, build LE LP (Maximize Σyⱼ), solve with SIMPLEX, normalise → seeker probabilities
    public double[] solveSeeker(int[][] payoffMatrix) {
        throw new UnsupportedOperationException("TODO");
    }

    // v = Σᵢ Σⱼ hiderStrategy[i] * seekerStrategy[j] * payoffMatrix[i][j]
    public double computeGameValue(int[][] payoffMatrix, double[] hiderStrategy, double[] seekerStrategy) {
        throw new UnsupportedOperationException("TODO");
    }

    // k = |min value in matrix| + 1  (0 if all values already positive)
    private int findShift(int[][] matrix) {
        return 0;
    }

    // shifted[i][j] = matrix[i][j] + k
    private double[][] shiftMatrix(int[][] matrix, int k) {
        return null;
    }

    // probs[i] = variableValues[i] / sum(variableValues[0..n-1])
    private double[] normaliseToProbabilities(List<Double> variableValues, int n) {
        return null;
    }
}
