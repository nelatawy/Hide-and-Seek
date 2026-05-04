import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameDataService } from '../../../services/game-data-service';
import { SpotCounts } from '../../models/spot-counts';

@Component({
  selector: 'app-spot-setup',
  imports: [FormsModule],
  templateUrl: './spot-setup.html',
  styleUrl: './spot-setup.css',
})
export class SpotSetup {
  easy_spots: number = 0;
  medium_spots: number = 0;
  hard_spots: number = 0;

  gameDataService: GameDataService;
  constructor(gameDataService: GameDataService) {
    this.gameDataService = gameDataService;
  }

  generateSpots() {
    console.log("setting spots" + this.easy_spots + this.medium_spots + this.hard_spots);
    let counts = new SpotCounts(this.easy_spots, this.medium_spots, this.hard_spots);
    this.gameDataService.setSpotCount(counts);
  }
}
