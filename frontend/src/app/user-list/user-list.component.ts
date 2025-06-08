import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environments';
import { UserService } from '../services/user/user.service';
import { DetailedUser } from '../../types/detailedUser';
import { format_date } from '../../utils/dateFormatting';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  formatDate = format_date

  private reactivationConfirmationModal! : NgbModalRef;
  @ViewChild('ReactivationConfirmationModal') reactivationConfirmationModalTempalte!: TemplateRef<any>;

  private deactivationConfirmationModal! : NgbModalRef;
  @ViewChild('DeactivationConfirmationModal') deactivationConfirmationModalTempalte!: TemplateRef<any>;

  public dataFetched : boolean = false;
  public loadingFailed = false;

  public users! : DetailedUser[];

  public userToDeactivate? : DetailedUser;
  public userToReactivate? : DetailedUser;

  public active : boolean | null = null;

  public showError = false;
  public errTitle = "";
  public errMessage = "";

  public appUrl! : string;

  constructor(
    private userService : UserService,
    private modalService : NgbModal,
  ){}

  ngOnInit(): void {
    this.appUrl = environment.appUrl;

    this.loadUsers();
  }

  loadUsers(){
    this.loadingFailed = false;
    this.dataFetched = false;

    this.userService.getAll(this.active).then(
      results => {

        this.users = results;
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


  openDeactivationConfirmationModal(){
    this.deactivationConfirmationModal = this.modalService.open(this.deactivationConfirmationModalTempalte);
  }

  closeDeactivationConfirmationModal(){
    if (this.deactivationConfirmationModal){
      this.deactivationConfirmationModal.close();
    }
    this.userToDeactivate = undefined;
  }

  openReactivationConfirmationModal(){
    this.reactivationConfirmationModal = this.modalService.open(this.reactivationConfirmationModalTempalte);
  }

  closeReactivationConfirmationModal(){
    if (this.reactivationConfirmationModal){
      this.reactivationConfirmationModal.close();
    }
    this.userToReactivate = undefined;
  }

  onDeactivateUserClicked(user : DetailedUser){
    this.userToDeactivate = user;
    this.openDeactivationConfirmationModal();
  }

  onReactivateUserClicked(user : DetailedUser){
    this.userToReactivate = user;
    this.openReactivationConfirmationModal();
  }

 indexOfUserWithId(id : number) : number{
    for (let i = 0; i < this.users.length; i++){
      if (this.users[i].id == id){
        return i;
      }
    }
    return -1;
  }

  deactivate(){
    if (!this.users || !this.userToDeactivate){
      return;
    }

    this.userService.deactivate(this.userToDeactivate.id!).then(
      result => {
        if (result){
          let user_index = this.indexOfUserWithId(this.userToDeactivate!.id!)

          if (user_index != -1){
            if (this.active == true){
              this.users?.splice(user_index, 1);
            }
            else{
              this.users[user_index].active = false;
            }
          }
          this.closeDeactivationConfirmationModal()
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when deactivating user, please try again."
          )
        }
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when dactivating user, please try again."
        )
      }
    )
  }

  reactivate(){
    if (!this.users || !this.userToReactivate){
      return;
    }

    this.userService.activate(this.userToReactivate.id!).then(
      result => {
        if (result){
          let user_index = this.indexOfUserWithId(this.userToReactivate!.id!)

          if (user_index != -1){
            if (this.active == false){
              this.users?.splice(user_index, 1);
            }
            else{
              this.users[user_index].active = true;
            }
          }
          this.closeReactivationConfirmationModal()
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when reactivating user, please try again."
          )
        }
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when reactivating user, please try again."
        )
      }
    )
  }
}
