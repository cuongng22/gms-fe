import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionUthComponent } from './production-uth.component';

describe('ProductionUthComponent', () => {
  let component: ProductionUthComponent;
  let fixture: ComponentFixture<ProductionUthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionUthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionUthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
