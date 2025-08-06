// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementEditComponent } from './announcement-edit.component';

describe('AnnouncementEditComponent', () => {
  let component: AnnouncementEditComponent;
  let fixture: ComponentFixture<AnnouncementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
