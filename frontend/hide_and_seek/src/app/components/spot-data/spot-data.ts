import { Component } from '@angular/core';
import { HidingSpot } from '../../models/hiding_spot';
import { GameDataService } from '../../../services/game-data-service';

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

  constructor(private gameDataService: GameDataService) {
    this.gameDataService.selectedSpot$.subscribe((spot) => {
      this.selected_spot = spot;
    });
  }

}
