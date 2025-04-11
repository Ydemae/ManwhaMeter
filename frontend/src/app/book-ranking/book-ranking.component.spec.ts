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
