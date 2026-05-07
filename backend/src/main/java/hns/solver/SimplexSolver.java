package hns.solver;

import hns.solver.model.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class SimplexSolver {

    public SolverResult twoPhase(List<Double> objectiveCoefficients, Tableau initialTableau, boolean isMax) {
        List<List<Double>> initialTable = initialTableau.getTable();
        List<AddedVarType> addedVars = initialTableau.getAddedVars();
        int originalSize = objectiveCoefficients.size() - addedVars.size();
        List<Integer> basis = initialTableau.getBaseIndices();

        List<Double> artificialObjective = new ArrayList<>(Collections.nCopies(objectiveCoefficients.size(), 0.0));
        for (int i = 0; i < addedVars.size(); i++)
            if (addedVars.get(i) == AddedVarType.ARTIFICIAL)
                artificialObjective.set(originalSize + i, 1.0);

        List<Double> zRow = computeZRow(artificialObjective, basis, initialTable);
        initialTable.add(zRow);

        initialTableau.setDescription("Phase 1: Initial Tableau");
        SolverResult firstPhase = simplex(initialTableau, false);
        Tableau firstPhaseTableau = firstPhase.getTableauSteps().get(firstPhase.getTableauSteps().size() - 1);

        for (int i = 0; i < addedVars.size(); i++) {
            if (addedVars.get(i) == AddedVarType.ARTIFICIAL && firstPhaseTableau.getBaseIndices().contains(i + originalSize)) {
                Tableau lastStep = firstPhase.getTableauSteps().get(firstPhase.getTableauSteps().size() - 1);
                lastStep.setDescription(lastStep.getDescription() + " | Infeasible: artificial variable remains in basis");
                firstPhase.setStatus(SolverStatus.INFEASIBLE);
                return firstPhase;
            }
        }

        Tableau newTableau = new Tableau(firstPhaseTableau.getStepNumber() + 1,
                firstPhaseTableau.getBaseIndices(), firstPhaseTableau.getAddedVars(),
                firstPhaseTableau.getTable(), firstPhaseTableau.getPivotRow(), firstPhaseTableau.getPivotColumn(),
                "Phase 2: Initial Tableau", firstPhaseTableau.getHeaders());
        List<List<Double>> newTable = newTableau.getTable();

        List<Integer> artificialIndices = IntStream.range(0, addedVars.size())
                .filter(i -> addedVars.get(i) == AddedVarType.ARTIFICIAL)
                .map(e -> e + originalSize)
                .boxed()
                .collect(Collectors.toCollection(ArrayList::new));

        newTable.remove(newTable.size() - 1);
        removeColumns(artificialIndices, newTable);
        addedVars.removeIf(e -> e == AddedVarType.ARTIFICIAL);
        newTableau.getHeaders().removeIf(e -> e.contains("a"));
        removeCoefficients(artificialIndices, objectiveCoefficients);

        List<Integer> remappedBases = new ArrayList<>();
        for (int baseIdx : newTableau.getBaseIndices()) {
            int shift = 0;
            for (int removedCol : artificialIndices)
                if (removedCol <= baseIdx) shift++;
            remappedBases.add(baseIdx - shift);
        }

        zRow = computeZRow(objectiveCoefficients, remappedBases, newTableau.getTable());
        newTable.add(zRow);
        newTableau.setBaseIndices(remappedBases);
        newTableau.setDescription("Phase 2: Initial Tableau (artificial variables removed)");
        SolverResult secondPhase = simplex(newTableau, isMax);

        return combineResults(firstPhase, secondPhase);
    }

    public SolverResult simplex(Tableau initialTableau, boolean isMax) {
        SolverResult result = new SolverResult();
        result.setTableauSteps(new ArrayList<>());

        List<List<Double>> table = initialTableau.getTable();
        List<Integer> currBases = new ArrayList<>(initialTableau.getBaseIndices());
        List<String> headers = initialTableau.getHeaders();
        int rows = table.size();
        int col = table.get(0).size();

        result.getTableauSteps().add(new Tableau(
                initialTableau.getStepNumber(), new ArrayList<>(currBases),
                initialTableau.getAddedVars(), deepCopy(table),
                initialTableau.getPivotRow(), initialTableau.getPivotColumn(),
                initialTableau.getDescription(), headers));

        int enteringIdx = getEnteringIdx(isMax, table.get(table.size() - 1));
        int stepNo = 1;

        while (enteringIdx != -1) {
            int leavingIdx = getLeavingIdx(table, enteringIdx);
            if (leavingIdx == -1) {
                result.setStatus(SolverStatus.UNBOUNDED);
                result.getTableauSteps().add(new Tableau(stepNo, new ArrayList<>(currBases),
                        initialTableau.getAddedVars(), deepCopy(table), -1, enteringIdx,
                        "Unbounded: no valid pivot found", headers));
                return result;
            }

            String leavingName = headers.get(currBases.get(leavingIdx));
            String enteringName = headers.get(enteringIdx);
            currBases.set(leavingIdx, enteringIdx);
            eliminateByPivot(leavingIdx, enteringIdx, table);

            String desc = String.format("Step %d: %s enters, %s leaves (pivot row %d, col %d)",
                    stepNo, enteringName, leavingName, leavingIdx, enteringIdx);
            result.getTableauSteps().add(new Tableau(stepNo, new ArrayList<>(currBases),
                    initialTableau.getAddedVars(), deepCopy(table), leavingIdx, enteringIdx, desc, headers));

            stepNo++;
            enteringIdx = getEnteringIdx(isMax, table.get(table.size() - 1));
        }

        int rhsIndex = col - 1;
        List<Double> variableValues = new ArrayList<>(Collections.nCopies(col - 1, 0.0));
        for (int baseRow = 0; baseRow < currBases.size(); baseRow++)
            variableValues.set(currBases.get(baseRow), table.get(baseRow).get(rhsIndex));

        result.setVariableValues(variableValues);
        for (Double val : variableValues) {
            if (val < 0) {
                result.setStatus(SolverStatus.INFEASIBLE);
                result.setOptimalValue(0);
                return result;
            }
        }
        result.setOptimalValue(-table.get(rows - 1).get(col - 1));
        result.setStatus(SolverStatus.OPTIMAL);
        return result;
    }

    public List<Double> computeZRow(List<Double> objectiveCoefficients, List<Integer> basesIndices, List<List<Double>> table) {
        List<Double> zRow = new ArrayList<>(objectiveCoefficients);
        zRow.add(0.0);
        for (int i = 0; i < table.size(); i++) {
            for (int j = 0; j < table.get(0).size() - 1; j++)
                zRow.set(j, zRow.get(j) - objectiveCoefficients.get(basesIndices.get(i)) * table.get(i).get(j));
            int idx = table.get(0).size() - 1;
            zRow.set(idx, zRow.get(idx) - objectiveCoefficients.get(basesIndices.get(i)) * table.get(i).get(idx));
        }
        return zRow;
    }

    private int getEnteringIdx(boolean isMax, List<Double> zRow) {
        int bestIdx = -1;
        int sign = isMax ? 1 : -1;
        double bestVal = -sign * 1e9;
        for (int i = 0; i < zRow.size() - 1; i++) {
            if (zRow.get(i) * sign > 0 && zRow.get(i) * sign > bestVal * sign) {
                bestVal = zRow.get(i);
                bestIdx = i;
            }
        }
        return bestIdx;
    }

    private int getLeavingIdx(List<List<Double>> table, int pivotColumn) {
        double minRatio = 1e9;
        int minIdx = -1;
        for (int r = 0; r < table.size() - 1; r++) {
            double candidate = table.get(r).get(pivotColumn);
            double newRatio = (candidate > 1e-12) ? table.get(r).get(table.get(0).size() - 1) / candidate : 1e12;
            if (candidate > 1e-12 && newRatio < minRatio) {
                minRatio = newRatio;
                minIdx = r;
            }
        }
        return minIdx;
    }

    private void eliminateByPivot(int pivotRow, int pivotCol, List<List<Double>> table) {
        double pivot = table.get(pivotRow).get(pivotCol);
        table.set(pivotRow, table.get(pivotRow).stream()
                .map(e -> e / pivot)
                .collect(Collectors.toCollection(ArrayList::new)));
        for (int i = 0; i < table.size(); i++) {
            if (i == pivotRow) continue;
            double factor = -table.get(i).get(pivotCol);
            for (int j = 0; j < table.get(i).size(); j++)
                table.get(i).set(j, table.get(i).get(j) + factor * table.get(pivotRow).get(j));
        }
    }

    private static List<List<Double>> deepCopy(List<List<Double>> table) {
        return table.stream().map(ArrayList::new).collect(Collectors.toCollection(ArrayList::new));
    }

    private static void removeColumns(List<Integer> cols, List<List<Double>> table) {
        for (List<Double> row : table)
            for (int j = row.size() - 1; j >= 0; j--)
                if (cols.contains(j)) row.remove(j);
    }

    private static void removeCoefficients(List<Integer> indices, List<Double> list) {
        for (int i = list.size() - 1; i >= 0; i--)
            if (indices.contains(i)) list.remove(i);
    }

    private static SolverResult combineResults(SolverResult first, SolverResult second) {
        SolverResult final_ = new SolverResult();
        List<Tableau> steps = new ArrayList<>(first.getTableauSteps());
        steps.addAll(second.getTableauSteps());
        final_.setTableauSteps(steps);
        final_.setStatus(second.getStatus());
        final_.setOptimalValue(second.getOptimalValue());
        final_.setVariableValues(second.getVariableValues());
        return final_;
    }
}
