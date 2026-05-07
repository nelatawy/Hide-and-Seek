import { Component, OnDestroy } from '@angular/core';
import { HidingSpot } from '../../models/hiding_spot';
import { Difficulty } from '../../models/difficulty';
import { GameDataService } from '../../services/game-data.service';
import { GameSettings } from '../../models/game-settings';
import { SolverStateService } from '../../services/solver-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements OnDestroy {
  private subs: Subscription[] = [];
  pickedCell: HTMLElement | null = null;
  cells = Array(16).fill(null);

  gameSettings: GameSettings | null = null;

  // should be part of the configuration
  easySpots: HidingSpot[] = [
    new HidingSpot(6, "Tavern Front", Difficulty.EASY, "assets/barrel_s.png", "assets/barrel_h.png", "Out in the open near the bustling tavern entrance. It's a very obvious spot, so the seeker will likely check here first!"),
    new HidingSpot(7, "Box Beside the Well", Difficulty.EASY, "assets/box_s.jpeg", "assets/box_h.png", "Just a simple box left carelessly by the town well. Not exactly the most stealthy hiding place for anyone trying to stay unseen."),
    new HidingSpot(9, "Around the Corner", Difficulty.EASY, "assets/corner_s_h.png", "assets/corner_s_h.png", "Barely tucked away around the street corner. A casual glance from the seeker is all it takes to spot someone here."),
    new HidingSpot(11, "Homeless on the Bridge", Difficulty.EASY, "assets/homeless_s_h.png", "assets/homeless_s_h.png", "Sitting in plain sight on the bridge among the travelers. The seeker won't have any trouble finding someone resting here.")
  ];
  mediumSpots: HidingSpot[] = [
    new HidingSpot(4, "HayStalk", Difficulty.MEDIUM, "assets/hay_s_h.png", "assets/hay_s_h.png", "A reasonably clever hiding spot that requires a bit of searching. The seeker might pass by it once before noticing anything out of place."),
    new HidingSpot(13, "Jake the Fern", Difficulty.MEDIUM, "assets/shore_s.png", "assets/shore_h.png", "Tucked away from the main path. The seeker will have to look closely and investigate thoroughly to uncover someone hiding here."),
    new HidingSpot(14, "Jake the Fern", Difficulty.MEDIUM, "assets/shore_s.png", "assets/shore_h.png", "Blends in decently with the surroundings. It will take a sharp eye from the seeker to spot a hider in this location.")
  ];
  hardSpots: HidingSpot[] = [
    new HidingSpot(5, "Odd looking statue", Difficulty.HARD, "assets/statue_s.jpeg", "assets/statue_h.jpg", "Perfectly camouflaged as an eerie statue. The seeker will almost certainly walk right past without a second thought!"),
    new HidingSpot(8, "Creepy Goth Room", Difficulty.HARD, "assets/room_s.jpg", "assets/room_h.png", "Hidden deep within a dark and unsettling room. The shadows provide excellent cover, making it a nightmare for the seeker to find you."),
    new HidingSpot(10, "Under the Bridge", Difficulty.HARD, "assets/bridge_s.png", "assets/bridge_h.png", "Concealed in the murky depths beneath the bridge structure. A very challenging spot for even the most experienced seeker to check."),
    new HidingSpot(16, "Coffin in the Cemetary", Difficulty.HARD, "assets/coffin_s.png", "assets/coffin_h.png", "A macabre and brilliant disguise. Who would dare check inside a coffin? The seeker will have a terrible time finding you here.")
  ];

  allSpots: HidingSpot[] = [...this.easySpots, ...this.mediumSpots, ...this.hardSpots];

  constructor(private gameDataService: GameDataService, private solverStateService: SolverStateService) { }

  ngOnInit(): void {


    this.subs.push(
      this.gameDataService.gameSettings$.subscribe((gameSettings) => {
        this.gameSettings = gameSettings;
        if (!this.gameSettings) {
          this.resetCells();
          return;
        };
        this.gameSettings.easy = Math.min(this.gameSettings.easy, this.easySpots.length);
        this.gameSettings.medium = Math.min(this.gameSettings.medium, this.mediumSpots.length);
        let ogTotal = gameSettings!.hard + gameSettings!.medium + gameSettings!.easy;
        let cappedTotal = this.gameSettings!.medium + this.gameSettings!.easy;
        this.gameSettings.hard = Math.min(this.gameSettings!.hard, ogTotal - cappedTotal);
        this.renderSpots();
      })
    );

    this.subs.push(
      this.solverStateService.result$.subscribe((result) => {
        // Clear all highlights
        let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
        Array.from(cells).forEach(cell => {
          cell.classList.remove('computer-picked');
          cell.classList.remove('picked');
        });


        if ((result as any).pickedSpot !== -1) {
          cells[(result as any).pickedSpot].classList.add("computer-picked");
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  renderSpots(): void {

    if (!this.gameSettings) return;
    console.log(this.gameSettings);
    let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
    this.resetCells();

    let pickedIndices: number[] = [];
    let easyIndices: number[] = [];
    let mediumIndices: number[] = [];
    let hardIndices: number[] = [];

    // console.log(this.gameSettings!.easy);
    // pick spots for easy
    for (let i = 0; i < this.gameSettings!.easy; i++) {
      let r = Math.floor(Math.random() * this.easySpots.length);
      while (pickedIndices.includes(r)) {
        r = Math.floor(Math.random() * this.easySpots.length);
      }
      pickedIndices.push(r);
      easyIndices.push(this.easySpots[r].index - 1);
      this.prepCell(Difficulty.EASY, this.easySpots[r].spot_image_url, cells[this.easySpots[r].index - 1]);
    }

    // console.log(this.gameSettings!.medium);
    pickedIndices = [];
    // pick spots for medium
    for (let i = 0; i < this.gameSettings!.medium; i++) {
      let r = Math.floor(Math.random() * this.mediumSpots.length);
      while (pickedIndices.includes(r)) {
        r = Math.floor(Math.random() * this.mediumSpots.length);
      }
      pickedIndices.push(r);
      mediumIndices.push(this.mediumSpots[r].index - 1);
      this.prepCell(Difficulty.MEDIUM, this.mediumSpots[r].spot_image_url, cells[this.mediumSpots[r].index - 1]);
    }
    // console.log(this.gameSettings!.hard);
    pickedIndices = [];
    // pick spots for hard
    for (let i = 0; i < this.gameSettings!.hard; i++) {
      let r = Math.floor(Math.random() * this.hardSpots.length);
      while (pickedIndices.includes(r)) {
        r = Math.floor(Math.random() * this.hardSpots.length);
      }
      pickedIndices.push(r);
      hardIndices.push(this.hardSpots[r].index - 1);
      this.prepCell(Difficulty.HARD, this.hardSpots[r].spot_image_url, cells[this.hardSpots[r].index - 1]);
    }

    this.gameDataService.setSpots(easyIndices, mediumIndices, hardIndices);
  }
  prepCell(difficulty: Difficulty, spot_image_url: string, cell: HTMLElement): void {
    cell.classList.add(difficulty.toString());
    let head = cell.children[0].children[0] as HTMLElement;
    head.style.backgroundImage = "url('" + spot_image_url + "')";
    cell.classList.add("spot");
  }

  pickCell(event: MouseEvent, index: number): void {
    const cell = event.currentTarget as HTMLElement;
    if (this.pickedCell != null) {
      this.pickedCell.classList.remove("picked");
    }
    this.pickedCell = cell;
    cell.classList.add("picked");
    // Find the spot by its 1-based index, but clone it and set 0-based index for the backend
    let spot = this.allSpots.find((spot) => spot.index === index + 1);
    if (spot) {
      let selected = new HidingSpot(index, spot.name, spot.difficulty, spot.spot_image_url, spot.hiding_image_url, spot.description);
      this.gameDataService.selectSpot(selected);
    }
  }

  resetCells() {
    let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
    Array.from(cells).forEach(cell => {
      cell.classList.remove('easy');
      cell.classList.remove('medium');
      cell.classList.remove('hard');
      cell.classList.remove('spot');
      cell.classList.remove('picked');
    });
  }
}
