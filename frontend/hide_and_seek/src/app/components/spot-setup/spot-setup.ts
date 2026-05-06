import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameDataService } from '../../services/game-data.service';
import { GameSettings } from '../../models/game-settings';

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
  is_hider: boolean = false;
  toggle_btn: HTMLButtonElement | null = null;

  gameDataService: GameDataService;
  constructor(gameDataService: GameDataService) {
    this.gameDataService = gameDataService;
  }
  ngAfterViewInit() {
    this.toggle_btn = document.getElementsByClassName('toggle-button')[0] as HTMLButtonElement;
    this.toggle_btn.classList.add("seeker-btn");
  }

  generateSpots() {
    console.log("setting spots" + this.easy_spots + this.medium_spots + this.hard_spots);
    let gameSettings = new GameSettings(this.easy_spots, this.medium_spots, this.hard_spots, this.is_hider);
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
}
