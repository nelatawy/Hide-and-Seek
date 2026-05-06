package hns.service;

import hns.model.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameService {

    private final PayoffMatrixService payoffMatrixService;
    private final LPSolverService lpSolverService;
    private final Random random = new Random();

    private GameSession currentSession;

    public GameService(PayoffMatrixService payoffMatrixService, LPSolverService lpSolverService) {
        this.payoffMatrixService = payoffMatrixService;
        this.lpSolverService = lpSolverService;
    }

    // Pick spots by difficulty, build payoff matrix, solve LP, store result in currentSession
    public GameSession setupGame(int easyCount, int mediumCount, int hardCount, PlayerRole humanRole) {
        throw new UnsupportedOperationException("TODO");
    }

    // Human picks a spot; computer samples from LP probabilities; update scores and return round result
    public Map<String, Object> playRound(int humanSpotIndex) {
        throw new UnsupportedOperationException("TODO");
    }

    // Run 100 rounds: human side = random uniform, computer side = LP-optimal; return win/score totals
    public Map<String, Object> simulate() {
        throw new UnsupportedOperationException("TODO");
    }

    // Set currentSession to null
    public void reset() {
        throw new UnsupportedOperationException("TODO");
    }

    public GameSession getCurrentSession() {
        return currentSession;
    }

    // Return all available HidingSpot objects for the given difficulty (mirrors frontend spot lists)
    private List<HidingSpot> buildSpotPool(Difficulty difficulty) {
        return List.of();
    }

    // Shuffle pool and take the first `count` spots
    private List<HidingSpot> pickSpots(List<HidingSpot> pool, int count) {
        return List.of();
    }

    // Roulette-wheel selection: draw a random double, walk the cumulative probability list
    private int sampleMove(List<Double> probabilities) {
        return 0;
    }

    // Look up payoffMatrix.get(hiderIndex).get(seekerIndex)
    private int calculatePayoff(int hiderIndex, int seekerIndex) {
        return 0;
    }
}