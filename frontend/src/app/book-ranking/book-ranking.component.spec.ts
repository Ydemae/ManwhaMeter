// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRankingComponent } from './book-ranking.component';

describe('BookRankingComponent', () => {
  let component: BookRankingComponent;
  let fixture: ComponentFixture<BookRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
