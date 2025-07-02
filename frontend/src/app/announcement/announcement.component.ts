

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Announcement } from '../../types/announcement';

@Component({
  selector: 'app-announcement',
  standalone: false,
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent implements OnInit{

  @Input()
  public arrayIndex! : number;

  @Input()
  public announcement! : Announcement;

  @Input()
  public canEdit! : boolean;

  @Output()
  public deactivateEmitter = new EventEmitter<number>();

  public postedTimeAgo! : string;
  public postedLabel! : string;

  ngOnInit(): void {
    this.calculateTimeSinceAnnouncement();
  }

  private calculateTimeSinceAnnouncement(){
    let announcementDate = new Date(this.announcement.createdAt);
    let todayDate = new Date()

    const diff = todayDate.getTime() - announcementDate.getTime();
    const diffInMinutes = Math.ceil(diff / 1000 / 60);
    const diffInHours = Math.ceil(diffInMinutes / 60);
    const diffInDays = Math.ceil(diffInHours/24);
    const diffInWeeks = Math.ceil(diffInDays/7);
    const diffInMonths = Math.ceil(diffInWeeks/4);
    const diffInYears = Math.ceil(diffInMonths/12);

    if (diffInMinutes/60 < 1){
      this.postedTimeAgo = diffInMinutes.toString();
      this.postedLabel = "minute";
    }
    else if (diffInHours/24 < 1){
      this.postedTimeAgo = diffInHours.toString();
      this.postedLabel = "hour";
    }
    else if (diffInDays/7 < 1){
      this.postedTimeAgo = diffInDays.toString();
      this.postedLabel = "day";
    }
    else if (diffInWeeks/4 < 1){
      this.postedTimeAgo = diffInWeeks.toString();
      this.postedLabel = "week";
    }
    else if (diffInMonths/ 12 < 1){
      this.postedTimeAgo = diffInMonths.toString();
      this.postedLabel = "month";
    }
    else{
      this.postedTimeAgo = diffInYears.toString();
      this.postedLabel = "year";
    }

    if (parseFloat(this.postedTimeAgo) > 1){
      this.postedLabel += "s";
    }
  }

  onDeactivateClicked(){
    this.deactivateEmitter.emit(this.arrayIndex);
  }

}
