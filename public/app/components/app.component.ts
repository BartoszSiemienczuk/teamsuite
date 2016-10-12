import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

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
    console.log("Activating template features.");
    $.AdminBSB.browser.activate();
    $.AdminBSB.leftSideBar.activate();
    $.AdminBSB.rightSideBar.activate();
    $.AdminBSB.navbar.activate();
    $.AdminBSB.dropdownMenu.activate();
    $.AdminBSB.input.activate();
    $.AdminBSB.select.activate();
    $.AdminBSB.search.activate();
  };
}
