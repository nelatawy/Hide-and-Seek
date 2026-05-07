package hns.service;

import hns.model.Difficulty;
import hns.model.HidingSpot;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PayoffMatrixService {

    // builds N×N payoff matrix: diagonal cell = hider caught at that spot, off-diagonal = hider safely hidden
    public List<List<Double>> buildPayoffMatrix(List<HidingSpot> spots) {
        int n = spots.size();
        List<List<Double>> matrix = new ArrayList<>();
        for (int h = 0; h < n; h++) {
            List<Double> row = new ArrayList<>();
            for (int s = 0; s < n; s++)
                row.add((double) ((h == s)
                                        ? diagonalPayoff(spots.get(h).getDifficulty())
                                        : offDiagonalPayoff(spots.get(h).getDifficulty())));
            matrix.add(row);
        }
        return matrix;
    }

    // 1D proximity: same matrix but reduces hider's off-diagonal reward based on index distance in the list
    public List<List<Double>> buildPayoffMatrix1DProximity(List<HidingSpot> spots) {
        int n = spots.size();
        List<List<Double>> matrix = new ArrayList<>();
        for (int h = 0; h < n; h++) {
            List<Double> row = new ArrayList<>();
            for (int s = 0; s < n; s++) {
                if (h == s) {
                    row.add((double) diagonalPayoff(spots.get(h).getDifficulty()));
                } else {
                    // distance = number of spots between hider and seeker positions in the list
                    int distance = Math.abs(h - s);
                    // closer seeker = lower reward for hider: 1 spot away: x0.5, 2 spots: x0.75, far: x1.0
                    double factor = (distance == 1) ? 0.5 : (distance == 2) ? 0.75 : 1.0;
                    row.add(offDiagonalPayoff(spots.get(h).getDifficulty()) * factor);
                }
            }
            matrix.add(row);
        }
        return matrix;
    }

    // 2D proximity: same as 1D but distance is measured as steps on the actual 4x4 grid
    public List<List<Double>> buildPayoffMatrix2DProximity(List<HidingSpot> spots) {
        int n = spots.size();
        List<List<Double>> matrix = new ArrayList<>();
        for (int h = 0; h < n; h++) {
            List<Double> row = new ArrayList<>();
            for (int s = 0; s < n; s++) {
                if (h == s) {
                    row.add((double) diagonalPayoff(spots.get(h).getDifficulty()));
                } else {
                    // counts how many steps apart the two spots are on the grid (horizontal + vertical steps)
                    int distance = gridDistance(spots.get(h).getIndex(), spots.get(s).getIndex());
                    // closer seeker = lower reward for hider: 1 step away: x0.5, 2 steps: x0.75, far: x1.0
                    double factor = (distance == 1) ? 0.5 : (distance == 2) ? 0.75 : 1.0;
                    row.add(offDiagonalPayoff(spots.get(h).getDifficulty()) * factor);
                }
            }
            matrix.add(row);
        }
        return matrix;
    }

    // finds how many grid steps separate two spots on the 4x4 map (horizontal steps + vertical steps)
    private int gridDistance(int indexA, int indexB) {
        int rowA = (indexA - 1) / 4, colA = (indexA - 1) % 4; // convert spot number to its row and column on the grid
        int rowB = (indexB - 1) / 4, colB = (indexB - 1) % 4;
        return Math.abs(rowA - rowB) + Math.abs(colA - colB); // total steps = row difference + column difference
    }

    // HARD: -3, MEDIUM: -1, EASY: -1 (hider's penalty when caught)
    private int diagonalPayoff(Difficulty difficulty) {
        return switch (difficulty) {
            case HARD -> -3;
            case MEDIUM -> -1;
            case EASY -> -1;
        };
    }

    // HARD: +1, MEDIUM: +1, EASY: +2 (hider's reward when seeker misses)
    private int offDiagonalPayoff(Difficulty difficulty) {
        return switch (difficulty) {
            case HARD -> 1;
            case MEDIUM -> 1;
            case EASY -> 2;
        };
    }
}
