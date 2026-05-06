import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SolverResult, SolverStatus, Tableau } from '../../models/solver-result.model';
import { SolverStateService } from '../../services/solver-state.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  status: SolverStatus = 'OPTIMAL';
  objectiveValue = 0;
  tolerance = '1E-9';

  variableValues: { name: string; type: string; value: number }[] = [];

  constructor(private state: SolverStateService, private router: Router) { }

  ngOnInit() {
    const result = this.state.getResult();
    if (!result) {
      this.router.navigate(['/solver']);
      return;
    }

    this.status = result.status;
    this.objectiveValue = result.optimalValue;

    // Use headers from the last tableau to get proper variable names & types
    const lastTableau = result.tableauSteps[result.tableauSteps.length - 1];
    const headers = lastTableau?.headers ?? [];

    const rawVars = result.variableValues.map((val, i) => {
      const rawName = i < headers.length ? headers[i] : `x${i + 1}`;
      const name = rawName.replace(/_\+$/, '⁺').replace(/_-$/, '⁻');
      let type = 'Decision';
      if (rawName.startsWith('s')) type = 'Slack';
      else if (rawName.startsWith('e')) type = 'Excess';
      else if (rawName.startsWith('a')) type = 'Artificial';
      return { name, rawName, type, value: val };
    });

    // Insert computed rows for split unrestricted variables (x_+ / x_-)
    const merged: { name: string; type: string; value: number }[] = [];
    for (let i = 0; i < rawVars.length; i++) {
      merged.push({ name: rawVars[i].name, type: rawVars[i].type, value: rawVars[i].value });
      // Check if this is a _+ variable followed by its _- counterpart
      if (rawVars[i].rawName.endsWith('_+') && i + 1 < rawVars.length && rawVars[i + 1].rawName.endsWith('_-')) {
        const baseName = rawVars[i].rawName.slice(0, -2); // strip "_+"
        const computedVal = rawVars[i].value - rawVars[i + 1].value;
        merged.push({ name: rawVars[i + 1].name, type: rawVars[i + 1].type, value: rawVars[i + 1].value });
        merged.push({ name: `${baseName} = ${rawVars[i].name} − ${rawVars[i + 1].name}`, type: 'Computed', value: computedVal });
        i++; // skip the _- entry since we already pushed it
      }
    }
    this.variableValues = merged;

    // Detect algorithm from addedVars across all tableau steps
    // const hasArtificial = result.tableauSteps.some(
    //   t => t.addedVars?.some(v => v === 'ARTIFICIAL')
    // );

    // this.executionMetrics = {
    //   iterations: result.tableauSteps.length,
    //   pivots: result.tableauSteps.filter(t => t.pivotRow >= 0).length,
    //   algorithm: hasArtificial ? 'Two-Phase Simplex' : 'Primal Simplex',
    // };
  }

  private sub(n: number): string { return String.fromCharCode(0x2080 + n); }

  get statusClass(): string { return this.status.toLowerCase(); }

  get statusMessage(): string | null {
    switch (this.status) {
      case 'INFEASIBLE':
        return 'No feasible solution exists. The constraints are contradictory — no point satisfies all of them simultaneously.';
      case 'UNBOUNDED':
        return 'The objective function is unbounded. The feasible region allows the objective to increase (or decrease) indefinitely.';
      default:
        return null;
    }
  }
}
