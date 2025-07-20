// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { RatingData } from '../../types/ratingData';
import { RatingFormComponent } from '../rating-form/rating-form.component';

@Component({
  selector: 'app-rating-modal',
  standalone: false,
  templateUrl: './rating-modal.component.html',
  styleUrl: './rating-modal.component.scss'
})
export class RatingModalComponent implements OnInit, OnChanges{
  @ViewChild(RatingFormComponent) ratingComponent!: RatingFormComponent;

  @Output()
  public closeModalEmitter = new EventEmitter<null>()

  @Output()
  public submitDataEmitter = new EventEmitter<RatingData>();

  @Input()
  public bookRating : RatingData | null = null;

  @Input()
  public modalTitle! : string;

  public correctFlag : boolean = false;
  public errorMessage : string = "";

  ngOnInit(){
    if (this.bookRating === null || this.bookRating === undefined){
      this.bookRating = {
        comment: "",
        story : null,
        art_style : null,
        characters : null,
        feeling : null
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bookRating === null || this.bookRating === undefined){
      this.bookRating = {
        comment: "",
        story : null,
        art_style : null,
        characters : null,
        feeling : null
      }
    }
  }

  close(){
    this.closeModalEmitter.emit()
  }

  updateCorrectFlag(flag : boolean){
    this.errorMessage = "";
    this.correctFlag = flag;
  }

  onSubmit(){
    this.ratingComponent.sendCorrectFlag();

    if (!this.correctFlag){
      this.errorMessage = "There is at least an error in the form.";
      return;
    }
    
    this.submitDataEmitter.emit(this.bookRating!);
  }
}
