import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  private flashMessage : string | null = null ;

  constructor() { }


  setFlashMessage(flashMessage : string){
    this.flashMessage = flashMessage;
  }

  getFlashMessage(){
    const flash = this.flashMessage;
    this.flashMessage = null;
    return flash;
  }
}
