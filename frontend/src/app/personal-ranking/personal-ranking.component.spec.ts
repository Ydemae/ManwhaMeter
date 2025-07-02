// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalRankingComponent } from './personal-ranking.component';

describe('PersonalRankingComponent', () => {
  let component: PersonalRankingComponent;
  let fixture: ComponentFixture<PersonalRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
