// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Rating } from '../../types/rating';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment',
  standalone: false,
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnChanges {
  @Input()
  public rating!: Rating;

  @Input()
  public canDelete : boolean = false;
  @Input()
  public canEdit : boolean = false;

  @Output()
  public deleteButtonClicked = new EventEmitter<null>();
  @Output()
  public editButtonClicked = new EventEmitter<null>();

  public totalRating : number = 0;

  ngOnInit(){
    this.totalRating = this.rating.art_style + this.rating.characters + this.rating.feeling + this.rating.story
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.totalRating = this.rating.art_style + this.rating.characters + this.rating.feeling + this.rating.story
  }

  public onDeleteClicked(){
    this.deleteButtonClicked.emit()
  }

  public onEditClicked(){
    this.editButtonClicked.emit()
  }
}
