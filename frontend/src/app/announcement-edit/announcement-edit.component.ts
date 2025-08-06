// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, OnInit } from '@angular/core';
import { BillboardService } from '../services/billboard/billboard.service';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Announcement } from '../../types/announcement';

@Component({
  selector: 'app-announcement-edit',
  standalone: false,
  templateUrl: './announcement-edit.component.html',
  styleUrl: './announcement-edit.component.scss'
})
export class AnnouncementEditComponent implements OnInit{

  public id! : number;
  public dataFetched = false;
  public loadingFailed = false;

  public data? : Announcement;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  constructor(
    private billboardService : BillboardService,
    private flashMessageService : FlashMessageService,
    private router : Router,
    private route : ActivatedRoute
  ){}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");

    if (id == null){
      this.router.navigate(["/"]);
      return;
    }

    this.id = parseInt(id!);

    this.loadData();
  }

  loadData(){
    this.dataFetched = false;
    this.data = undefined;
    this.loadingFailed = false;

    this.billboardService.getOneById(this.id)
    .then(
      result => {
        this.data = result;
        this.dataFetched = true;
      }
    )
    .catch(
      error => {
        this.loadingFailed = true;
      }
    )
  }

  updateAnnouncement(data : {id : number, title : string, message : string}){

    this.billboardService.update(data.id, data.title, data.message).then(
      results => {
        if (results == true){
          this.flashMessageService.setFlashMessage("Announcement successfully edited");
          this.router.navigate(["/"]);
        }
        else{
          this.displayError("Unexpected error", "An unexpected error occurred when trying to update the announcement, please try again.");
        }
      }
    ).catch(
      error => {
        this.displayError("Unexpected error", "An unexpected error occurred when trying to update the announcement, please try again.");
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
