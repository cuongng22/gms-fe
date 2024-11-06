import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforPlaneComponent } from './infor-plane.component';

describe('InforPlaneComponent', () => {
  let component: InforPlaneComponent;
  let fixture: ComponentFixture<InforPlaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InforPlaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InforPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
