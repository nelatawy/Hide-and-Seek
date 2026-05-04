import { Component, AfterViewInit } from '@angular/core';
import { HidingSpot } from '../../models/hiding_spot';
import { Difficulty } from '../../models/difficulty';
import { SpotDataService } from '../../../services/spot-data-service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit {
  picked_cell: HTMLElement | null = null;
  cells = Array(16).fill(null);

  // should be eventually supplied from the form component
  easy_cnt = 2;
  medium_cnt = 1;
  hard_cnt = 1;

  // should be part of the configuration
  easy_spots: HidingSpot[] = [
    new HidingSpot(6, "Tavern Front", Difficulty.EASY, "assets/hide1.jpeg", "", "description"),
    new HidingSpot(7, "Beside the Well", Difficulty.EASY, "assets/hide2.jpg", "", "description"),
    new HidingSpot(9, "Around the Corner", Difficulty.EASY, "assets/hide3.jpeg", "", "description"),
    new HidingSpot(11, "Homeless on the Bridge", Difficulty.EASY, "assets/hide1.jpeg", "", "description")
  ];
  medium_spots: HidingSpot[] = [
    new HidingSpot(4, "medium1", Difficulty.MEDIUM, "assets/hide1.jpeg  ", "", "description"),
    new HidingSpot(13, "medium2", Difficulty.MEDIUM, "assets/hide2.jpg", "", "description"),
    new HidingSpot(14, "medium3", Difficulty.MEDIUM, "assets/hide3.jpeg", "", "description")
  ];
  hard_spots: HidingSpot[] = [
    new HidingSpot(5, "hard1", Difficulty.HARD, "assets/hide1.jpeg", "", "description"),
    new HidingSpot(8, "hard2", Difficulty.HARD, "assets/hide2.jpg", "", "description"),
    new HidingSpot(10, "hard3", Difficulty.HARD, "assets/hide3.jpeg", "", "description"),
    new HidingSpot(16, "hard4", Difficulty.HARD, "assets/hide1.jpeg", "", "description")
  ];

  all_spots: HidingSpot[] = [...this.easy_spots, ...this.medium_spots, ...this.hard_spots];

  spotDataService: SpotDataService;
  constructor(spotDataService: SpotDataService) {
    this.spotDataService = spotDataService;
  }
  ngAfterViewInit(): void {
    let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
    let picked_indices: number[] = [];


    // pick spots for easy
    for (let i = 0; i < this.easy_cnt; i++) {
      let r = Math.floor(Math.random() * this.easy_spots.length);
      while (picked_indices.includes(r)) {
        r = Math.floor(Math.random() * this.easy_spots.length);
      }
      picked_indices.push(r);
      this.prepCell(Difficulty.EASY, this.easy_spots[r].spot_image_url, cells[this.easy_spots[r].index - 1]);
    }

    // pick spots for medium
    for (let i = 0; i < this.medium_cnt; i++) {
      let r = Math.floor(Math.random() * this.medium_spots.length);
      while (picked_indices.includes(r)) {
        r = Math.floor(Math.random() * this.medium_spots.length);
      }
      picked_indices.push(r);
      this.prepCell(Difficulty.MEDIUM, this.medium_spots[r].spot_image_url, cells[this.medium_spots[r].index - 1]);
    }

    // pick spots for hard
    for (let i = 0; i < this.hard_cnt; i++) {
      let r = Math.floor(Math.random() * this.hard_spots.length);
      while (picked_indices.includes(r)) {
        r = Math.floor(Math.random() * this.hard_spots.length);
      }
      picked_indices.push(r);
      this.prepCell(Difficulty.HARD, this.hard_spots[r].spot_image_url, cells[this.hard_spots[r].index - 1]);
    }


  }
  prepCell(difficulty: Difficulty, spot_image_url: string, cell: HTMLElement): void {
    cell.classList.add(difficulty.toString());
    let head = cell.children[0].children[0] as HTMLElement;
    head.style.backgroundImage = "url('" + spot_image_url + "')";
    cell.classList.add("spot");
  }

  pickCell(event: MouseEvent, index: number): void {
    const cell = event.currentTarget as HTMLElement;
    if (this.picked_cell != null) {
      this.picked_cell.classList.remove("picked");
    }
    this.picked_cell = cell;
    cell.classList.add("picked");
    this.spotDataService.selectSpot(this.all_spots.find((spot) => spot.index === index + 1) || null);
  }
}
