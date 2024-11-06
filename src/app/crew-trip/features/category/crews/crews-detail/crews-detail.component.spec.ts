import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewsDetailComponent } from './crews-detail.component';

describe('CrewsDetailComponent', () => {
  let component: CrewsDetailComponent;
  let fixture: ComponentFixture<CrewsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrewsDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CrewsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
