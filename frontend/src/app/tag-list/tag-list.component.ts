import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from '../../types/tag';
import { TagService } from '../services/tag/tag.service';

@Component({
  selector: 'app-tag-list',
  standalone: false,
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent {
  private creationModal! : NgbModalRef;
  @ViewChild('CreationModal') creationModalTemplate!: TemplateRef<any>;

  private deletionConfirmationModal! : NgbModalRef;
  @ViewChild('DeletionConfirmationModal') deletionConfirmationModalTemplate!: TemplateRef<any>;

  public dataFetched : boolean = false;

  public tags! : Tag[];

  public tagIdToDelete? : number;

  public active : boolean | null = null;

  public showError = false;
  public errTitle = "";
  public errMessage = "";


  constructor(
    private tagService : TagService,
    private modalService : NgbModal,
  ){}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(){
    this.tagService.getAll().then(
      results => {

        this.tags = results;
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


  openDeletionConfirmationModal(){
    this.deletionConfirmationModal = this.modalService.open(this.deletionConfirmationModalTemplate);
  }

  closeDeletionConfirmationModal(){
    if (this.deletionConfirmationModal){
      this.deletionConfirmationModal.close();
    }
    this.tagIdToDelete = undefined;
  }

  openCreationModal(){
    this.creationModal = this.modalService.open(this.creationModalTemplate);
  }

  closeCreationModal(){
    if (this.creationModal){
      this.creationModal.close();
    }
  }

  onDeleteTagClicked(tagId : number){
    this.tagIdToDelete = tagId;
    this.openDeletionConfirmationModal();
  }

  onCreateTagClicked(){
    this.openCreationModal();
  }

  delete(){
    if (!this.tags || !this.tagIdToDelete){
      return;
    }

    this.tagService.delete(this.tags[this.tagIdToDelete].id).then(
      result => {
        if (result){
          this.tags?.splice(this.tagIdToDelete!, 1);
          this.closeDeletionConfirmationModal()
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when deleting tag, please try again."
          )
        }
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when deleting tag, please try again."
        )
      }
    )
  }

  create(label : string){
    if (!this.tags){
      return;
    }

    this.tagService.create(label).then(
      result => {
        if (result){
          this.loadTags();
          this.closeCreationModal();
        }
        else{
          this.displayError(
            "Unexpected error",
            "An unexpected error occured when creating tag, please try again."
          )
        }
      }
    ).catch(
      error => {
        this.displayError(
          "Unexpected error",
          "An unexpected error occured when creating tag, please try again."
        )
      }
    )
  }
}
