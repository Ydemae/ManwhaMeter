// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultPlaceholderComponent } from './no-result-placeholder.component';

describe('NoResultPlaceholderComponent', () => {
  let component: NoResultPlaceholderComponent;
  let fixture: ComponentFixture<NoResultPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoResultPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResultPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
