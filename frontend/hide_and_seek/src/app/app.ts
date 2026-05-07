import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './components/map/map';
import { SpotData } from './components/spot-data/spot-data';
import { SpotSetup } from "./components/spot-setup/spot-setup";
import { ResultsComponent } from './components/results/results.component';
import { GameResult } from './models/gameResult';
import { SimulationResults } from './models/simulationResults';
import { SolverStateService } from './services/solver-state.service';
import { GameDataService } from './services/game-data.service';
import { CommonModule } from '@angular/common';
import { LinearMap } from './components/linear-map/linear-map';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Map, LinearMap, SpotData, SpotSetup, ResultsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  solutionExists: boolean = false;
  solution: GameResult | SimulationResults | null = null;
  mapMode: '1D' | '2D' = '1D';

  protected readonly title = signal('hide_and_seek');

  constructor(private state: SolverStateService, private gameData: GameDataService) { }

  ngOnInit(): void {
    this.state.result$.subscribe((res) => {
      this.solutionExists = res != null;
      this.solution = res;
    });
    this.gameData.mapMode$.subscribe((mode) => {
      this.mapMode = mode;
    });
  }

  ngAfterViewInit(): void {
    this.playAudio('assets/audio.mp3');
    let cloud = document.getElementsByClassName('clouds')[0] as HTMLElement;
    setTimeout(() => {
      cloud.style.transform = "translateY(-100vh)";
    }, 100);
  }


  playAudio(src: string): void {
    let audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play().catch(error => console.error("Failed to play audio:", error));
  }


}


