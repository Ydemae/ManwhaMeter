import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { InviteService } from '../services/invite/invite.service';
import { Invite } from '../../types/invite';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environments';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite-tracker',
  standalone: false,
  templateUrl: './invite-tracker.component.html',
  styleUrl: './invite-tracker.component.scss'
})
export class InviteTrackerComponent implements OnInit{

  private inviteModal! : NgbModalRef;
  @ViewChild('CreatedInviteModal') inviteModalTemplate!: TemplateRef<any>;

  private confirmationModal! : NgbModalRef;
  @ViewChild('ConfirmationModal') confirmationModalTempalte!: TemplateRef<any>;

  public dataFetched : boolean = false;
  public invites? : Invite[];

  public createdInvite? : Invite;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  public appUrl! : string;

  public copied : boolean = false;

  public inviteToDeleteId : number | null = null

  constructor(
    private authService : AuthService,
    private inviteService : InviteService,
    private modalService : NgbModal,
    private clipboard : Clipboard,
    private router : Router
  ){}

  ngOnInit(): void {
    if (!this.authService.isAdminSubject.value || !this.authService.isLoggedInSubject.value){
      this.router.navigate(["/home"]);
    }

    this.appUrl = environment.appUrl;

    this.loadInvites(null);
  }

  loadInvites(used : boolean | null){
    this.inviteService.getAll().then(
      results => {

        this.invites = results;
        this.dataFetched = true;
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when fetching data from server, please try again.\nIf the problem persists, contact the support."
        )
      }
    )
  }

  createInvite(){
    this.inviteService.create().then(
      result => {
        this.createdInvite = result;
        this.openInviteModal();
        this.loadInvites(null);
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when fetching data from server, please try again.\nIf the problem persists, contact the support."
        )
      }
    )
  }

  formatDate(date: string): string {

    let dateObject = new Date(date);

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
  
    return `${day}/${month}/${year}`;
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


  openInviteModal(){
    this.inviteModal = this.modalService.open(this.inviteModalTemplate);
  }

  closeInviteModal(){
    if (this.inviteModal){
      this.inviteModal.close();
    }
  }

  copyInviteToClipboard(){
    this.clipboard.copy(`${this.appUrl}/register/${this.createdInvite?.uid}`)
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  openConfirmationModal(){
    this.confirmationModal = this.modalService.open(this.confirmationModalTempalte);
  }

  closeConfirmationModal(){
    if (this.confirmationModal){
      this.inviteToDeleteId = null;
      this.confirmationModal.close();
    }
  }

  onDeleteInviteClicked(id : number){
    this.inviteToDeleteId = id;
    this.openConfirmationModal();
  }

  deleteInvite(){
    if (this.invites == null || this.inviteToDeleteId == null){
      return;
    }

    this.inviteService.delete(this.invites![this.inviteToDeleteId!].id).then(
      result => {
        if (result){
          this.invites?.splice(this.inviteToDeleteId!, 1);
          this.closeConfirmationModal()
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when deleting the invite, please try again."
          )
        }
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when deleting the invite, please try again."
        )
      }
    )
  }

}
