import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotSetup } from './spot-setup';

describe('SpotSetup', () => {
  let component: SpotSetup;
  let fixture: ComponentFixture<SpotSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
