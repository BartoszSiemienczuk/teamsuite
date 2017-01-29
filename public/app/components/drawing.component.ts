import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import {DrawingService} from "../services/drawing.service";

declare var $:any;
@Component({
    selector: 'teamsuite-drawing',
    templateUrl: '/app/views/chat/paint.html'
})
export class DrawingComponent implements OnInit, OnDestroy, AfterViewInit {
    private userList = [];
    private subscriber_;
    public color = "#000";
    public canvasCtx;

    constructor(private userService: UserService, private Router: Router, private chatService: ChatService, private drawingService: DrawingService) { }

    ngOnInit(){
        this.subscriber_ = this.drawingService.getObservable().subscribe((res:any) => {
            if (res.messageType == "draw") {
                console.log("drawing");
                this.drawline(
                    res.messageObject.fromx,
                    res.messageObject.fromy,
                    res.messageObject.tox,
                    res.messageObject.toy,
                    res.messageObject.color,
                    res.messageObject.thickness,
                );
            }
            if (res.messageType == "userlist") {
                this.userList = res.messageObject;
            }
            if(res.messageType=="clear"){
                this.canvasCtx.clearRect(0, 0, 2000, 2000);
            }
        });
    }

    sendDrawing(fromx, fromy, tox, toy, color, thickness){
        this.drawingService.sendDrawing(fromx, fromy, tox, toy, color, thickness);
    }

    drawline (x, y, x2, y2, color, thickness){
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x, y);
        this.canvasCtx.lineTo(x2, y2);
        this.canvasCtx.strokeStyle=color;
        this.canvasCtx.lineWidth=thickness;
        this.canvasCtx.stroke();
    }

    sendClear(){
        this.drawingService.sendClear();
    }

    ngOnDestroy(){
        this.subscriber_.unsubscribe();
    }

    ngAfterViewInit(): void {
        $('.colorpicker').colorpicker();
        this.canvasScript();
    }

    get userData(){
        return this.userService.userData;
    }

    get activeTeam(){
        return this.userService.activeTeam;
    }

    private canvasScript(){
        var component = this;
        var canvas = $("#drawing-canvas");
        canvas.attr('width',canvas.width());
        var canvasCtx = canvas[0].getContext('2d');
        component.canvasCtx = canvasCtx;
        var color=$('#color');
        var thickness=$('#thick');
        var drawing = false;

        // socket.on("drawing-moving", function(data){
        //     if(!(data.id in clients)){
        //         console.log("New user connected!");
        //     }
        //
        //     if(data.drawing && clients[data.id]){
        //         drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
        //     }
        //
        //     // Saving the current client state
        //     clients[data.id] = data;
        //     clients[data.id].updated = $.now();
        // });

        let prev = {x:0, y:0};

        canvas.on("mousedown", function(e){
            e.preventDefault();

            var parentOffset = $(this).offset();
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            drawing = true;
            prev.x = x;
            prev.y = y;
        });

        $(document).on("mouseup mouseleave", function(){
            drawing=false;
        });

        var lastEmit=$.now();

        canvas.on("mousemove", function(e){
            var parentOffset = $(this).offset();
            var x = e.pageX - parentOffset.left;
            var y = e.pageY - parentOffset.top;

            if($.now() - lastEmit > 30){
                // socket.emit("drawing-mousemoving", {
                //     x,
                //     y,
                //     drawing,
                //     id
                // });
            }

            if(drawing){
                drawline(prev.x, prev.y, x, y, color.val(), thickness.val());
                prev.x = x;
                prev.y = y;
            }
        });

        $('#clear').click(function(e){
            canvasCtx.clearRect(0, 0, canvas.width(), canvas.height());
            component.sendClear();
        });

        var drawline = function(x, y, x2, y2, color, thickness){
            canvasCtx.beginPath();
            canvasCtx.moveTo(x, y);
            canvasCtx.lineTo(x2, y2);
            canvasCtx.strokeStyle=color;
            canvasCtx.lineWidth=thickness;
            canvasCtx.stroke();

            component.sendDrawing(x,y,x2,y2,color, thickness);
        }
    }
}