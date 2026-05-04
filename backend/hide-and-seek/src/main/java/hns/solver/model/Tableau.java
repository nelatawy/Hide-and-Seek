package hns.solver.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tableau {
    private int stepNumber;
    private List<Integer> baseIndices;
    private List<AddedVarType> addedVars;
    private List<List<Double>> table;
    private int pivotRow;
    private int pivotColumn;
    private String description;
    private List<String> headers;
}
