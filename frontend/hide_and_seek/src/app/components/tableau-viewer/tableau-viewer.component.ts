import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Tableau } from '../../models/solver-result.model';
import { SolverStateService } from '../../services/solver-state.service';

interface TableauRow {
  basis: string;
  values: number[];
  isPivotRow: boolean;
}

interface TableauStep {
  stepNumber: number;
  phase: number;
  headers: string[];
  rows: TableauRow[];
  pivotRow: number;
  pivotCol: number;
  description: string;
  log: string[];
  objectiveValue: number;
}

@Component({
  selector: 'app-tableau-viewer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau-viewer.component.html',
  styleUrl: './tableau-viewer.component.css',
})
export class TableauViewerComponent implements OnInit {
  currentStep = 0;
  steps: TableauStep[] = [];

  constructor(private state: SolverStateService) { }

  ngOnInit() {
    this.state.result$.subscribe((res) => {
      if (!res || res.tableauSteps.length === 0) {
        return;
      }
      console.log(res);
      this.steps = res.tableauSteps.map(t => this.adapt(t));
      this.currentStep = 0;
    });

  }

  private adapt(t: Tableau): TableauStep {
    const lastRowIdx = t.table.length - 1;

    // Use headers from backend if available; otherwise fall back to generic column names
    const rawHeaders = t.headers?.length
      ? t.headers
      : Array.from({ length: (t.table[0]?.length ?? 1) - 1 }, (_, i) => `x${i + 1}`);
    // Backend may not include "RHS" — always ensure it is the last header so column count matches table
    const withRhs = rawHeaders[rawHeaders.length - 1]?.toUpperCase() === 'RHS'
      ? rawHeaders
      : [...rawHeaders, 'RHS'];
    const headers = withRhs.map(h => h.replace(/_\+$/, '⁺').replace(/_-$/, '⁻'));

    // Build one TableauRow per matrix row
    const rows: TableauRow[] = t.table.map((rowValues, rowIdx) => {
      // Last row is always the Z (objective) row
      if (rowIdx === lastRowIdx) {
        return { basis: 'Z', values: rowValues, isPivotRow: false };
      }
      // For constraint rows: find the basis variable name using baseIndices[rowIdx]
      const basisColIdx = t.baseIndices[rowIdx];
      const basisName = basisColIdx < headers.length - 1 ? headers[basisColIdx] : `x${basisColIdx + 1}`;
      return { basis: basisName, values: rowValues, isPivotRow: rowIdx === t.pivotRow };
    });

    // Z row RHS stores -Z (simplex convention) — negate to show the actual objective value
    const lastRow = t.table[lastRowIdx] ?? [];
    const objectiveValue = -(lastRow[lastRow.length - 1] ?? 0);

    return {
      stepNumber: t.stepNumber,
      phase: 1,
      headers,
      rows,
      pivotRow: t.pivotRow,
      pivotCol: t.pivotColumn,
      description: t.description,
      log: [t.description],
      objectiveValue,
    };
  }

  get current(): TableauStep { return this.steps[this.currentStep]; }
  get totalSteps(): number { return this.steps.length; }

  prev() { if (this.currentStep > 0) this.currentStep--; }
  next() { if (this.currentStep < this.steps.length - 1) this.currentStep++; }

  isPivotCell(rowIdx: number, colIdx: number): boolean {
    return rowIdx === this.current.pivotRow && colIdx === this.current.pivotCol;
  }

  isZRow(rowIdx: number): boolean {
    return this.current.rows[rowIdx].basis === 'Z';
  }

  formatVal(n: number): string { return n.toFixed(4); }

  trackByIdx(i: number) { return i; }
}
