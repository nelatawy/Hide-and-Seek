import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameDataService } from '../../services/game-data.service';
import { GameSettings } from '../../models/game-settings';
import { SolverService } from '../../services/solver.service';
import { SolverStateService } from '../../services/solver-state.service';
import { PlayerRole } from '../../models/playerRole';

@Component({
  selector: 'app-spot-setup',
  imports: [FormsModule, CommonModule],
  templateUrl: './spot-setup.html',
  styleUrl: './spot-setup.css',
})
export class SpotSetup {
  total_spots: number = 0;
  is_hider: boolean = false;
  is2D: boolean = false;
  proximityEnabled: boolean = false;
  toggle_btn: HTMLButtonElement | null = null;

  constructor(
    private gameDataService: GameDataService,
    private solverService: SolverService,
    private solverStateService: SolverStateService
  ) { }

  ngAfterViewInit() {
    this.toggle_btn = document.getElementsByClassName('toggle-button')[0] as HTMLButtonElement;
    this.toggle_btn.classList.add("seeker-btn");
  }

  onMapToggle() {
    this.gameDataService.resetGameSettings();
    this.gameDataService.setMapMode(this.is2D ? '2D' : '1D');
  }

  generateSpots() {
    let easy = Math.floor(this.total_spots / 3);
    let medium = Math.floor(this.total_spots / 3);
    let hard = this.total_spots - (easy + medium);

    let gameSettings = new GameSettings(easy, medium, hard, this.is_hider, this.is2D ? 2 : 1, this.proximityEnabled);
    this.gameDataService.setGameSettings(gameSettings);
  }

  toggleHider() {
    this.is_hider = !this.is_hider;
    if (this.is_hider) {
      this.toggle_btn!.classList.remove("seeker-btn");
      this.toggle_btn!.classList.add("hider-btn");
    } else {
      this.toggle_btn!.classList.remove("hider-btn");
      this.toggle_btn!.classList.add("seeker-btn");
    }
  }

  simulate() {
    if (this.total_spots === 0) return;

    const settings = {
      n: this.total_spots,
      role: this.is_hider ? PlayerRole.HIDER : PlayerRole.SEEKER,
      numberOfSims: 100,
      proximity: this.proximityEnabled,
      dimensions: this.is2D ? 2 : 1
    };

    this.solverService.simulate(settings).subscribe((result) => {
      this.solverStateService.setResult(result);
    });
  }

  reset() {
    this.total_spots = 0;
    this.is_hider = false;
    this.proximityEnabled = false;
    this.toggle_btn!.classList.remove("hider-btn");
    this.toggle_btn!.classList.add("seeker-btn");
    this.solverStateService.clear();
    this.solverStateService.resetGlobalScores();
    this.gameDataService.resetGameSettings();
  }
}
