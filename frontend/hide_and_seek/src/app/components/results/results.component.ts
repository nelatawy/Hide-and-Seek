import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameResult } from '../../models/gameResult';
import { SimulationResults } from '../../models/simulationResults';
import { SolverStateService } from '../../services/solver-state.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  result: GameResult | SimulationResults | null = null;

  constructor(public state: SolverStateService) { }

  ngOnInit() {
    this.state.result$.subscribe((res) => {
      this.result = res;
    });
  }

  isSimulation(): boolean {
    return this.result !== null && 'humanScore' in this.result;
  }

  get asSimulation(): SimulationResults {
    return this.result as SimulationResults;
  }

  get asGame(): GameResult {
    return this.result as GameResult;
  }

  reset(): void {
    this.state.clear();
  }
}
