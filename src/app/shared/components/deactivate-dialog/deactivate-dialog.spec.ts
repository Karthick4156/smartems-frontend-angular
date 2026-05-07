import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateDialog } from './deactivate-dialog';

describe('DeactivateDialog', () => {
  let component: DeactivateDialog;
  let fixture: ComponentFixture<DeactivateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeactivateDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
