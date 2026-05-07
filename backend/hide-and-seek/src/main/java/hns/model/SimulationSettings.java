package hns.model;

import lombok.Data;

@Data
public class SimulationSettings {
    int n;
    PlayerRole role;
    int numberOfSims;
    boolean proximity;
    int dimensions;
}
