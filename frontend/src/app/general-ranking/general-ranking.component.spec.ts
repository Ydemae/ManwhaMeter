// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRankingComponent } from './general-ranking.component';

describe('GeneralRankingComponent', () => {
  let component: GeneralRankingComponent;
  let fixture: ComponentFixture<GeneralRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
