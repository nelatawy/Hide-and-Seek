export interface SimulationResults {
    computerProb: number[];
    gameValue: number;
    payoffMatrix: number[][];
    humanRoundsWon: number;
    computerRoundsWon: number;
    humanScore: number;
    computerScore: number;
}
