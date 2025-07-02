// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagCreateModalComponent } from './tag-create-modal.component';

describe('TagCreateModalComponent', () => {
  let component: TagCreateModalComponent;
  let fixture: ComponentFixture<TagCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
