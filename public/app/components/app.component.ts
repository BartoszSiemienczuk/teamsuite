import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';

declare var $:any;

@Component({
  selector: 'teamsuite-app',
  templateUrl: '/app/views/master.html'
})

export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(){ };
  
  ngOnInit(){ };
  ngOnDestroy(){ };
  
  ngAfterViewInit() {
    $.AdminBSB.browser.activate();
    $.AdminBSB.dropdownMenu.activate();
    $.AdminBSB.input.activate();
    $.AdminBSB.select.activate();
  };
}
