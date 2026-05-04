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
}
