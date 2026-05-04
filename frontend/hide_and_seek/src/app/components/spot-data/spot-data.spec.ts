import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotData } from './spot-data';

describe('SpotData', () => {
  let component: SpotData;
  let fixture: ComponentFixture<SpotData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
