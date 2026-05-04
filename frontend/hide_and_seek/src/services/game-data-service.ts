import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HidingSpot } from '../app/models/hiding_spot';
import { SpotCounts } from '../app/models/spot-counts';

@Injectable({ providedIn: 'root' })
export class GameDataService {

    private _selectedSpot = new BehaviorSubject<HidingSpot | null>(null);
    selectedSpot$ = this._selectedSpot.asObservable();

    private _spotCounts = new BehaviorSubject<SpotCounts | null>(null);
    spotCounts$ = this._spotCounts.asObservable();

    selectSpot(spot: HidingSpot | null): void {
        this._selectedSpot.next(spot);
    }

    setSpotCount(spotCounts: SpotCounts): void {
        console.log("setting spot count from service");
        console.log(spotCounts);
        this._spotCounts.next(spotCounts);
    }

    getSpotCount(): SpotCounts | null {
        return this._spotCounts.getValue();
    }


}