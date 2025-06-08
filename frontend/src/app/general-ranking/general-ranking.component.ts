import { Component, OnInit } from '@angular/core';
import { FlashMessageService } from '../services/flashMessage/flash-message.service';

@Component({
  selector: 'app-general-ranking',
  standalone: false,
  templateUrl: './general-ranking.component.html',
  styleUrl: './general-ranking.component.scss'
})
export class GeneralRankingComponent implements OnInit{

  public flashMessage! : string | null;

  constructor(
    private flashMessageService : FlashMessageService
  ){}

  ngOnInit(): void {
    this.flashMessage = this.flashMessageService.getFlashMessage()
  }

}
