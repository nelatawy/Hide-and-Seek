package hns.service;

import hns.model.Difficulty;
import hns.model.HidingSpot;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayoffMatrixService {

    // For each (h,s) pair: diagonal (h==s) → diagonalPayoff, off-diagonal → offDiagonalPayoff
    public int[][] buildPayoffMatrix(List<HidingSpot> spots) {
        throw new UnsupportedOperationException("TODO");
    }

    // HARD → -3, MEDIUM → -1, EASY → -1  (hider's penalty when caught)
    private int diagonalPayoff(Difficulty difficulty) {
        return 0;
    }

    // HARD → +1, MEDIUM → +1, EASY → +2  (hider's reward when seeker misses)
    private int offDiagonalPayoff(Difficulty difficulty) {
        return 0;
    }
}
