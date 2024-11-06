import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMailDetailComponent } from './group-mail-detail.component';

describe('GroupMailDetailComponent', () => {
  let component: GroupMailDetailComponent;
  let fixture: ComponentFixture<GroupMailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMailDetailComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GroupMailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
