import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: false,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  @Output()
  public cancelEmitter = new EventEmitter<null>()

  @Output()
  public confirmEmitter = new EventEmitter<null>();

  @Input()
  public text! : string;

  @Input()
  public title! : string;

  ngOnInit(){
    
  }

  onCancel(){
    this.cancelEmitter.emit()
  }

  onConfirm(){
    this.confirmEmitter.emit();
  }
}
