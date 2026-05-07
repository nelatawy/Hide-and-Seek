import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearMap } from './linear-map';

describe('LinearMap', () => {
  let component: LinearMap;
  let fixture: ComponentFixture<LinearMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinearMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
