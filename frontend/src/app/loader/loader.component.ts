// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  @Input()
  public loadingFailed : boolean = false;

  @Output()
  public retryEmitter = new EventEmitter<null>();

  retry(){
    this.retryEmitter.emit();
  }
}
