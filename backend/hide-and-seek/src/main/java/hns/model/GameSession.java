package hns.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class GameSession {
    private List<HidingSpot> spots;
    private int[][] payoffMatrix;
    private double[] hiderProbabilities;
    private double[] seekerProbabilities;
    private double gameValue;
    private PlayerRole humanRole;
    private double humanScore;
    private double computerScore;
    private int humanRoundsWon;
    private int computerRoundsWon;
    private int totalRounds;
}
