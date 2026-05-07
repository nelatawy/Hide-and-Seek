package hns.model;

import lombok.Data;

import java.util.List;
@Data
public class GameSettings {
    List<Integer> easySpots;
    List<Integer> mediumSpots;
    List<Integer> hardSpots;

    PlayerRole role;
    int pickedSpot;

    int dimensions;
    boolean proximity;

}