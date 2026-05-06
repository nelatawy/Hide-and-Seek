import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './components/map/map';
import { SpotData } from './components/spot-data/spot-data';
import { SpotSetup } from "./components/spot-setup/spot-setup";
import { TableauViewerComponent } from "./components/tableau-viewer/tableau-viewer.component";
import { SolverResult } from './models/solver-result.model';
import { SolverStateService } from './services/solver-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Map, SpotData, SpotSetup, TableauViewerComponent, TableauViewerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  solutionExists: boolean = false;
  solution: SolverResult | null = null;

  protected readonly title = signal('hide_and_seek');

  constructor(private state: SolverStateService) { }

  ngOnInit(): void {
    this.state.result$.subscribe((res) => {
      this.solutionExists = res != null;
      this.solution = res;
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


