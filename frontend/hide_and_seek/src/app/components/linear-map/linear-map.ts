import { Component, OnDestroy } from '@angular/core';
import { GameSettings } from '../../models/game-settings';
import { HidingSpot } from '../../models/hiding_spot'
import { Difficulty } from '../../models/difficulty';
import { GameResult } from '../../models/gameResult'
import { GameDataService } from '../../services/game-data.service';
import { SolverStateService } from '../../services/solver-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-linear-map',
  imports: [],
  templateUrl: './linear-map.html',
  styleUrl: './linear-map.css',
})
export class LinearMap implements OnDestroy {
  private subs: Subscription[] = [];

  pickedCell: HTMLElement | null = null;
  cells = Array(16).fill(null);

  gameSettings: GameSettings | null = null;

  // index part is useless in 1D since we pick randomly and place the slot with this data
  easySpots: HidingSpot[] = [
    new HidingSpot(-1, "Tavern Front", Difficulty.EASY, "assets/barrel_s.png", "assets/barrel_h.png", "Out in the open near the bustling tavern entrance. It's a very obvious spot, so the seeker will likely check here first!"),
    new HidingSpot(-1, "Box Beside the Well", Difficulty.EASY, "assets/box_s.jpeg", "assets/box_h.png", "Just a simple box left carelessly by the town well. Not exactly the most stealthy hiding place for anyone trying to stay unseen."),
    new HidingSpot(-1, "Around the Corner", Difficulty.EASY, "assets/corner_s_h.png", "assets/corner_s_h.png", "Barely tucked away around the street corner. A casual glance from the seeker is all it takes to spot someone here."),
    new HidingSpot(-1, "Homeless on the Bridge", Difficulty.EASY, "assets/homeless_s_h.png", "assets/homeless_s_h.png", "Sitting in plain sight on the bridge among the travelers. The seeker won't have any trouble finding someone resting here.")
  ];
  mediumSpots: HidingSpot[] = [
    new HidingSpot(-1, "medium1", Difficulty.MEDIUM, "assets/hide1.jpeg  ", "", "A reasonably clever hiding spot that requires a bit of searching. The seeker might pass by it once before noticing anything out of place."),
    new HidingSpot(-1, "medium2", Difficulty.MEDIUM, "assets/hide2.jpg", "", "Tucked away from the main path. The seeker will have to look closely and investigate thoroughly to uncover someone hiding here."),
    new HidingSpot(-1, "medium2", Difficulty.MEDIUM, "assets/hide2.jpg", "", "Tucked away from the main path. The seeker will have to look closely and investigate thoroughly to uncover someone hiding here."),
    new HidingSpot(-1, "medium3", Difficulty.MEDIUM, "assets/hide3.jpeg", "", "Blends in decently with the surroundings. It will take a sharp eye from the seeker to spot a hider in this location.")
  ];
  hardSpots: HidingSpot[] = [
    new HidingSpot(-1, "Odd looking statue", Difficulty.HARD, "assets/statue_s.jpeg", "assets/statue_h.jpg", "Perfectly camouflaged as an eerie statue. The seeker will almost certainly walk right past without a second thought!"),
    new HidingSpot(-1, "Creepy Goth Room", Difficulty.HARD, "assets/room_s.jpg", "assets/room_h.png", "Hidden deep within a dark and unsettling room. The shadows provide excellent cover, making it a nightmare for the seeker to find you."),
    new HidingSpot(-1, "Under the Bridge", Difficulty.HARD, "assets/bridge_s.png", "assets/bridge_h.png", "Concealed in the murky depths beneath the bridge structure. A very challenging spot for even the most experienced seeker to check."),
    new HidingSpot(-1, "Coffin in the Cemetery", Difficulty.HARD, "assets/coffin_s.png", "assets/coffin_h.png", "A macabre and brilliant disguise. Who would dare check inside a coffin? The seeker will have a terrible time finding you here.")
  ];

  allSpots: (HidingSpot | null)[] = [];

  constructor(private gameDataService: GameDataService, private solverStateService: SolverStateService) { }

  ngOnInit(): void {
    this.subs.push(
      this.gameDataService.gameSettings$.subscribe((gameSettings) => {
        this.gameSettings = gameSettings;
        this.resetCells();
        if (this.gameSettings) {
          let totalCnt = this.gameSettings.easy + this.gameSettings.medium + this.gameSettings.hard;
          this.cells = Array(totalCnt).fill(null);
          this.allSpots = new Array(totalCnt).fill(null);
          setTimeout(() => this.renderSpots(), 0);
        }
      })
    );

    this.subs.push(
      this.solverStateService.result$.subscribe((result) => {
        if (!result || !('pickedSpot' in result)) return;
        if ((result as any).pickedSpot !== -1) {
          let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
          cells[(result as any).pickedSpot].classList.add("computer-picked");
        } else {
          let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
          Array.from(cells).forEach(cell => cell.classList.remove("computer-picked"));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  renderSpots(): void {
    if (!this.gameSettings) return;

    let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
    this.resetCells();

    let easyIndices: number[] = [];
    let mediumIndices: number[] = [];
    let hardIndices: number[] = [];

    let easyCnt = this.gameSettings.easy;
    let mediumCnt = this.gameSettings.medium;
    let hardCnt = this.gameSettings.hard;
    let totalCnt = easyCnt + mediumCnt + hardCnt;

    // Create an array of 0..totalCnt-1 and shuffle it
    let availableSlots = Array.from({ length: totalCnt }, (_, i) => i);
    for (let i = availableSlots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableSlots[i], availableSlots[j]] = [availableSlots[j], availableSlots[i]];
    }

    // pick spots for easy
    for (let i = 0; i < easyCnt; i++) {
      let r = availableSlots.pop()!;
      this.allSpots[r] = this.easySpots[r % this.easySpots.length];
      easyIndices.push(r);
      this.prepCell(Difficulty.EASY, this.easySpots[r % this.easySpots.length].spot_image_url, cells[r]);
    }

    // pick spots for medium
    for (let i = 0; i < mediumCnt; i++) {
      let r = availableSlots.pop()!;
      this.allSpots[r] = this.mediumSpots[r % this.mediumSpots.length];
      mediumIndices.push(r);
      this.prepCell(Difficulty.MEDIUM, this.mediumSpots[r % this.mediumSpots.length].spot_image_url, cells[r]);
    }

    // pick spots for hard
    for (let i = 0; i < hardCnt; i++) {
      let r = availableSlots.pop()!;
      this.allSpots[r] = this.hardSpots[r % this.hardSpots.length];
      hardIndices.push(r);
      this.prepCell(Difficulty.HARD, this.hardSpots[r % this.hardSpots.length].spot_image_url, cells[r]);
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
    let newSpot: HidingSpot = this.allSpots[index]!.clone();
    newSpot.index = index;
    this.gameDataService.selectSpot(newSpot || null);
  }

  resetCells() {
    let cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLElement>;
    Array.from(cells).forEach(cell => {
      cell.classList.remove('easy');
      cell.classList.remove('medium');
      cell.classList.remove('hard');
      cell.classList.remove('picked');
    });
  }

}
