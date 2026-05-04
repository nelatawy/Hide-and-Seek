import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './components/map/map';
import { SpotData } from './components/spot-data/spot-data';
import { SpotSetup } from "./components/spot-setup/spot-setup";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Map, SpotData, SpotSetup],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hide_and_seek');
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
