import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteTrackerComponent } from './invite-tracker.component';

describe('InviteTrackerComponent', () => {
  let component: InviteTrackerComponent;
  let fixture: ComponentFixture<InviteTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InviteTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
