import { Injectable } from '@angular/core';

declare var $:any;

@Injectable()
export class NotificationsService {
    public add(type: string, text: string) {
      $.AdminBSB.showNotification("alert-"+type, text, "bottom", "right", "", "");
    }
}