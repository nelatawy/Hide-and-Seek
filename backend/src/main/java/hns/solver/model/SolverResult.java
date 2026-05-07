package hns.solver.model;

import lombok.Data;
import java.util.List;

@Data
public class SolverResult {
    private List<Tableau> tableauSteps;
    private List<Double> variableValues;
    private double optimalValue;
    private SolverStatus status;
}
