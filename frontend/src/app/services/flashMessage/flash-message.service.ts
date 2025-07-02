// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

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
