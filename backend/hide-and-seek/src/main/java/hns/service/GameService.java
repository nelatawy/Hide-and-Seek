package hns.service;

import hns.model.*;
import hns.solver.model.SolverResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final PayoffMatrixService payoffMatrixService;
    private final LPSolverService lpSolverService;

    public GameService(PayoffMatrixService payoffMatrixService, LPSolverService lpSolverService) {
        this.payoffMatrixService = payoffMatrixService;
        this.lpSolverService = lpSolverService;
    }

    private int getPickedSpot(List<Double> probs){
        double val = Math.random();
        int itr = 0;
        double currValue = probs.get(0);
        while (val > currValue){
            itr++;
            currValue += probs.get(itr);
        }

        return itr;
    }

    public GameResult play(GameSettings game){
        List<HidingSpot> spots = generateSpots(game);
        List<List<Double>> payoffMatrix;
        if (game.isProximity() && game.getDimensions() == 1) {
            payoffMatrix = payoffMatrixService.buildPayoffMatrix1DProximity(spots);
        } else if (game.isProximity() && game.getDimensions() == 2) {
            payoffMatrix = payoffMatrixService.buildPayoffMatrix2DProximity(spots);
        } else {
            payoffMatrix = payoffMatrixService.buildPayoffMatrix(spots);
        }

        SolverResult result = (game.getRole() == PlayerRole.HIDER)? lpSolverService.solveSeeker(payoffMatrix) : lpSolverService.solveHider(payoffMatrix);
        double gameVal = result.getOptimalValue();
        List<Double> computerProb = result.getVariableValues();

        int computerPickIdx = getPickedSpot(computerProb);
        
        int mapIndex = game.getPickedSpot();

        int humanPick = -1;
        for (int i = 0; i < spots.size(); i++) {
            if (spots.get(i).getIndex() == mapIndex) {
                humanPick = i;
                break;
            }
        }

        int hiderIdx  = (game.getRole() == PlayerRole.HIDER) ? humanPick : computerPickIdx;
        int seekerIdx = (game.getRole() == PlayerRole.HIDER) ? computerPickIdx : humanPick;
        double roundPayoff = payoffMatrix.get(hiderIdx).get(seekerIdx);


        return new GameResult(payoffMatrix, gameVal, computerProb, spots.get(computerPickIdx).getIndex(), roundPayoff);
    }

    public SimulationResults simulate(SimulationSettings settings){
        int n = settings.getN();

        List<HidingSpot> spots = generateRandomSpots(n);

        List<List<Double>> payoff;
        if (settings.isProximity() && settings.getDimensions() == 1) {
            payoff = payoffMatrixService.buildPayoffMatrix1DProximity(spots);
        } else if (settings.isProximity() && settings.getDimensions() == 2) {
            payoff = payoffMatrixService.buildPayoffMatrix2DProximity(spots);
        } else {
            payoff = payoffMatrixService.buildPayoffMatrix(spots);
        }

        SolverResult result = (settings.getRole() == PlayerRole.HIDER)? lpSolverService.solveSeeker(payoff) : lpSolverService.solveHider(payoff);
        double gameVal = result.getOptimalValue();
        List<Double> computerProb =  result.getVariableValues();

        double compScore = 0, humanScore = 0;
        int humanWins = 0, compWins = 0;

        for (int i = 0; i < settings.getNumberOfSims(); i++) {
            int humanPick = (int) (Math.random() * n);
            int computerPick = getPickedSpot(computerProb);

            int hiderIdx  = (settings.getRole() == PlayerRole.HIDER) ? humanPick : computerPick;
            int seekerIdx = (settings.getRole() == PlayerRole.HIDER) ? computerPick : humanPick;
            double roundPayoff = payoff.get(hiderIdx).get(seekerIdx);

            if (settings.getRole() == PlayerRole.HIDER) {
                humanScore += roundPayoff;
                compScore  -= roundPayoff;
            } else {
                compScore  += roundPayoff;
                humanScore -= roundPayoff;
            }

            if (roundPayoff > 0) {
                if (settings.getRole() == PlayerRole.HIDER) humanWins++; else compWins++;
            } else if (roundPayoff < 0) {
                if (settings.getRole() == PlayerRole.SEEKER) humanWins++; else compWins++;
            }
        }

        return new SimulationResults(computerProb,gameVal,payoff,humanWins,compWins,humanScore,compScore);
    }

    private List<HidingSpot> generateRandomSpots(int totalSpots) {
        Difficulty[] types = Difficulty.values();
        List<HidingSpot> spots = new ArrayList<>();
        for (int i = 0; i < totalSpots; i++)
            spots.add(new HidingSpot(i, types[(int) (Math.random() * types.length)]));
        // It's already generated in order 0 to totalSpots-1, so no sort needed here, but keeping for safety
        return spots;
    }

    private List<HidingSpot> generateSpots(GameSettings game){
        List<HidingSpot> spots = new ArrayList<>();
        for(Integer idx : game.getEasySpots())
            spots.add(new HidingSpot(idx, Difficulty.EASY));

        for(Integer idx : game.getMediumSpots())
            spots.add(new HidingSpot(idx, Difficulty.MEDIUM));

        for(Integer idx : game.getHardSpots())
            spots.add(new HidingSpot(idx, Difficulty.HARD));

        // CRITICAL: Sort by index so the matrix rows/cols align with the physical layout
        spots.sort(Comparator.comparingInt(HidingSpot::getIndex));
        return spots;
    }
}