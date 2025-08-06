// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component } from '@angular/core';
import { BillboardService } from '../services/billboard/billboard.service';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement-create',
  standalone: false,
  templateUrl: './announcement-create.component.html',
  styleUrl: './announcement-create.component.scss'
})
export class AnnouncementCreateComponent {

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private billboardService : BillboardService,
    private flashMessageService : FlashMessageService,
    private router : Router
  ){}

  createAnnouncement(data : {id : number, title : string, message : string}){

    this.billboardService.create(data.title, data.message).then(
      results => {
        if (results == true){
          this.flashMessageService.setFlashMessage("Announcement successfully created");
          this.router.navigate(["/"]);
        }
        else{
          this.displayError("Unexpected error", "An unexpected error occurred when trying to create the announcement, please try again.");
        }
      }
    ).catch(
      error => {
        this.displayError("Unexpected error", "An unexpected error occurred when trying to create the announcement, please try again.");
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
}
