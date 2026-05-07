import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './components/map/map';
import { SpotData } from './components/spot-data/spot-data';
import { SpotSetup } from "./components/spot-setup/spot-setup";
import { ResultsComponent } from './components/results/results.component';
import { GameResult } from './models/gameResult';
import { SimulationResults } from './models/simulationResults';
import { HidingSpot } from './models/hiding_spot';
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
export class App implements OnDestroy {
  solutionExists: boolean = false;
  solution: GameResult | SimulationResults | null = null;
  mapMode: '1D' | '2D' = '1D';

  private bgAudio: HTMLAudioElement | null = null;


  selectedSpot: HidingSpot | null = null;
  showFoundPopup = false;
  foundSpotImageUrl: string = '';
  popupTimeLeft = 5;
  private popupTimer: any = null;

  protected readonly title = signal('hide_and_seek');

  constructor(private state: SolverStateService, private gameData: GameDataService) { }

  ngOnInit(): void {
    this.gameData.selectedSpot$.subscribe((spot) => {
      this.selectedSpot = spot;
    });

    this.state.result$.subscribe((res) => {
      this.solutionExists = res != null;
      this.solution = res;

      if (res && 'pickedSpot' in res && (res as any).pickedSpot !== -1) {
        if (this.selectedSpot && (res as any).pickedSpot === this.selectedSpot.index) {
          this.foundSpotImageUrl = this.selectedSpot.hiding_image_url || this.selectedSpot.spot_image_url;
          this.openFoundPopup();
        }
      }
    });

    this.gameData.mapMode$.subscribe((mode) => {
      this.mapMode = mode;
      let bg = document.getElementsByClassName("blurred-background")[0] as HTMLElement;
      if (bg) {
        if (mode == "1D") {
          bg.style.backgroundImage = "url('/assets/linear-map.png')";
        }
        else {
          bg.style.backgroundImage = "url('/assets/map-night.png')";
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.playAudio('assets/audio.mp3');
    let cloud = document.getElementsByClassName('clouds')[0] as HTMLElement;
    setTimeout(() => {
      cloud.style.transform = "translateY(-100vh)";
    }, 100);
  }


  openFoundPopup(): void {
    this.showFoundPopup = true;
    this.popupTimeLeft = 5;
    if (this.popupTimer) clearInterval(this.popupTimer);
    this.popupTimer = setInterval(() => {
      this.popupTimeLeft--;
      if (this.popupTimeLeft <= 0) this.closePopup();
    }, 1000);
  }

  closePopup(): void {
    this.showFoundPopup = false;
    if (this.popupTimer) {
      clearInterval(this.popupTimer);
      this.popupTimer = null;
    }
  }

  ngOnDestroy(): void {
    if (this.popupTimer) clearInterval(this.popupTimer);
  }

  playAudio(src: string): void {
    this.bgAudio = new Audio();
    this.bgAudio.src = src;
    this.bgAudio.loop = true;
    this.bgAudio.load();
    setTimeout(() => this.bgAudio?.play().catch(error => console.error("Failed to play audio:", error)), 3000);
  }
}


