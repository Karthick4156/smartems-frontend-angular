import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Corrections } from './corrections';

describe('Corrections', () => {
  let component: Corrections;
  let fixture: ComponentFixture<Corrections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Corrections],
    }).compileComponents();

    fixture = TestBed.createComponent(Corrections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
