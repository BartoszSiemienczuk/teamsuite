import { Component, AfterViewInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'teamsuite-topbar',
  templateUrl: '/app/views/shared/topbar.html'
})
export class TopbarComponent implements AfterViewInit {
  constructor () { }
  
  ngAfterViewInit(){
    $.AdminBSB.search.activate();
  }
}
