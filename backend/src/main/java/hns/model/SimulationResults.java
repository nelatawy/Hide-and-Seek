package hns.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SimulationResults {
    List<Double> computerProb;
    double gameValue;
    List<List<Double>> payoffMatrix;
    int humanRoundsWon;
    int computerRoundsWon;
    double humanScore;
    double computerScore;
}
