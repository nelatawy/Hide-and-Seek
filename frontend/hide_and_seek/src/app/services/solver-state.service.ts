import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SolverResult } from '../models/solver-result.model';

@Injectable({ providedIn: 'root' })
export class SolverStateService {
  private resultSubject = new BehaviorSubject<SolverResult | null>(null);

  result$ = this.resultSubject.asObservable();

  setResult(result: SolverResult): void {
    this.resultSubject.next(result);
  }

  getResult(): SolverResult | null {
    return this.resultSubject.getValue();
  }

  clear(): void {
    this.resultSubject.next(null);
  }
}
