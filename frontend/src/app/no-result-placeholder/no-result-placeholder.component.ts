// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-result-placeholder',
  standalone: false,
  templateUrl: './no-result-placeholder.component.html',
  styleUrl: './no-result-placeholder.component.scss'
})
export class NoResultPlaceholderComponent {

  @Input()
  public title! : string;

  @Input()
  public subtitle! : string;

  @Input()
  public updates! : boolean;

  @Input()
  public icon! : string;
}
