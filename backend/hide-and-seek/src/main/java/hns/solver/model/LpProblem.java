package hns.solver.model;

import lombok.Data;
import java.util.List;

@Data
public class LpProblem {
    private SolverMethod method;
    private boolean maximization;
    private List<Double> objectiveCoefficients;
    private List<List<Double>> constraintCoefficients;
    private List<ConstraintType> constraintTypes;
    private List<Double> rhsValues;
    private List<Integer> unrestrictedVariables;
}
