import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualProductionComponent } from './annual-production.component';

describe('AnnualProductionComponent', () => {
  let component: AnnualProductionComponent;
  let fixture: ComponentFixture<AnnualProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnualProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
