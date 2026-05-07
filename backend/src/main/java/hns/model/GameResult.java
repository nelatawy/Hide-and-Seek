package hns.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class GameResult {
    List<List<Double>> payoffMatrix;
    double gameValue;
    List<Double> computerProb;
    int pickedSpot;
    double roundPayoff;
}