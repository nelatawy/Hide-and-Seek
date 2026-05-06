import { Component } from '@angular/core';
import { HidingSpot } from '../../models/hiding_spot';
import { GameDataService } from '../../services/game-data.service';
import { SolverService } from '../../services/solver.service';
import { SolverStateService } from '../../services/solver-state.service';

@Component({
  selector: 'app-spot-data',
  imports: [],
  templateUrl: './spot-data.html',
  styleUrl: './spot-data.css',
})
export class SpotData {
  selected_spot: HidingSpot | null = null;

  initial_title: string = "Pick A Spot";
  initial_description: string = "Click on a cell to select it";

  constructor(private gameDataService: GameDataService,
    private solverService: SolverService,
    private solverStateService: SolverStateService) {

    this.gameDataService.selectedSpot$.subscribe((spot) => {
      this.selected_spot = spot;
    });
  }

  finalize_selection(): void {
    if (!this.selected_spot || !this.gameDataService) return;

    this.solverService.solve(this.gameDataService.getGameSettings()!, this.selected_spot.index).subscribe((result) => {
      this.solverStateService.setResult(result);
    });
  }

}
