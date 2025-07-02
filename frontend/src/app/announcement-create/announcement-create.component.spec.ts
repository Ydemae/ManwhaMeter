// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementCreateComponent } from './announcement-create.component';

describe('AnnouncementCreateComponent', () => {
  let component: AnnouncementCreateComponent;
  let fixture: ComponentFixture<AnnouncementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncementCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
