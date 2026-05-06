export type SolverStatus = 'OPTIMAL' | 'INFEASIBLE' | 'UNBOUNDED';

// enum that maps Java AddedVarType, tells us what type each added column is
export type AddedVarType = 'SLACK' | 'EXCESS' | 'ARTIFICIAL';

export interface Tableau {
  stepNumber: number;
  baseIndices: number[];
  addedVars: AddedVarType[];  // types of added columns in order e.g. [SLACK, ARTIFICIAL]
  table: number[][];
  pivotRow: number;
  pivotColumn: number;
  description: string;
  headers: string[];          // column labels sent by backend e.g. ["x1","x2","s1","a1","RHS"]
}

export interface SolverResult {
  status: SolverStatus;
  optimalValue: number;
  variableValues: number[];
  tableauSteps: Tableau[];
}
