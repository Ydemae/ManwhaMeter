import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { BillboardService } from '../services/billboard/billboard.service';
import { Announcement } from '../../types/announcement';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';

@Component({
  selector: 'app-billboard',
  standalone: false,
  templateUrl: './billboard.component.html',
  styleUrl: './billboard.component.scss'
})
export class BillboardComponent implements OnInit, OnChanges {

  public dataFetched : boolean = false;
  public announcements? : Announcement[];
  public isAdmin : boolean = false;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  public flashMessage : string = "";

  constructor (
    private authService : AuthService,
    private billboardService : BillboardService,
    private flashMessageService : FlashMessageService
  ){}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminSubject.value;
    this.loadAnnouncements();
    let flashMessage = this.flashMessageService.getFlashMessage()
    this.flashMessage = flashMessage != null ? flashMessage : "";
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isAdmin = this.authService.isAdminSubject.value;
    this.loadAnnouncements();
    let flashMessage = this.flashMessageService.getFlashMessage()
    this.flashMessage = flashMessage != null ? flashMessage : "";
  }

  private loadAnnouncements(){

    this.billboardService.getAllActive().then(
      results => {
        this.announcements = results;
        this.dataFetched = true;
      }
    )
    .catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when fetching data from server, please try again."
        )
      }
    )
  }

  displayError(
    title : string,
    message : string
  ){
    this.errTitle = title;
    this.errMessage = message;
    this.showError = true;
  }

  hideError(){
    this.showError = false;
  }

  hideFlash(){
    this.flashMessage = "";
  }

  deactivate(arrayIndex : number){
    this.billboardService.deactivate(this.announcements![arrayIndex].id!).then(
      result => {
        if (result == true){
          this.announcements?.splice(arrayIndex, 1);
        }
        else{
          this.displayError("Unexpected error", "An unexpected error occurred while trying to deactivate announcement");
        }
      }
    ).catch(
      error => {
        this.displayError("Unexpected error", "An unexpected error occurred while trying to deactivate announcement");
      }
    )
  }
}
