import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HidingSpot } from '../app/models/hiding_spot';

@Injectable({ providedIn: 'root' })
export class SpotDataService {

    private _selectedSpot = new BehaviorSubject<HidingSpot | null>(null);


    selectedSpot$ = this._selectedSpot.asObservable();

    selectSpot(spot: HidingSpot | null): void {
        this._selectedSpot.next(spot);
    }
}