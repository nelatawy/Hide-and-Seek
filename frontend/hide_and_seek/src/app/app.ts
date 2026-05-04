import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './components/map/map';
import { SpotData } from './components/spot-data/spot-data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Map, SpotData],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hide_and_seek');
}
