import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
declare let MediaRecorder: any;
@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css']
})
export class CamaraComponent implements OnInit {

     //Video Record and Play By Rajesh Gami
     videoElement: HTMLVideoElement;
     recordVideoElement: HTMLVideoElement;
     mediaVideoRecorder: any;
     videoRecordedBlobs: Blob[];
     isRecording: boolean = false;
     finishedrecording: boolean = false;
     downloadVideoUrl: string;
     stream: MediaStream;
     
     
     @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
     @ViewChild('liveVideo') videoElementRef: ElementRef;
     constructor(public dialog: MatDialog) {}
     async ngOnInit() {
        this.userMedia();
     }
     IniciarGrabacion() {
        this.finishedrecording = false;
         this.videoRecordedBlobs = [];
         let options: any = {
             mimeType: 'video/webm',
         };
         try {
             this.mediaVideoRecorder = new MediaRecorder(this.stream, options);
         } catch (err) {
             console.log(err);
         }
         this.mediaVideoRecorder.start();
         this.isRecording = !this.isRecording;
         this.onVideoEvent();
         this.onStopVideo();
     }
     detenerGrabacion() {
         this.mediaVideoRecorder.stop();
         this.isRecording = !this.isRecording;
     }
     playRecording() {
         if (!this.videoRecordedBlobs || !this.videoRecordedBlobs.length) {
             return;
         }
         this.recordVideoElement.play();
     }
     onVideoEvent() {
         try {
             this.mediaVideoRecorder.ondataavailable = (event: any) => {
                 if (event.data && event.data.size > 0) {
                     this.videoRecordedBlobs.push(event.data);
                 }
             };
         } catch (error) {
             console.log(error);
         }
     }
     onStopVideo() {
         try {
             this.mediaVideoRecorder.onstop = (event: Event) => {
                 const videoBuffer = new Blob(this.videoRecordedBlobs, {
                     type: 'video/mpeg'
                 });
                 this.downloadVideoUrl = window.URL.createObjectURL(videoBuffer);
                 this.recordVideoElement.src = this.downloadVideoUrl;
                 window.open(this.recordVideoElement.src);
             };
         } catch (error) {
             console.log(error);
         }
     }

     userMedia(){
        navigator.mediaDevices.getUserMedia({
            video: {
                width: 480,
                facingMode:"user"
            },
            audio:true
        }).then(stream => {
            this.videoElement = this.videoElementRef.nativeElement;
            this.recordVideoElement = this.recordVideoElementRef.nativeElement;
            this.stream = stream;
            this.videoElement.muted = true
            this.videoElement.play()
            this.videoElement.srcObject = this.stream;
        });
     }
     openDialogConfirmacion(): void {
        const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
            width: '300px',
            
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if (result){
                this. detenerGrabacion();
                this.finishedrecording = true;
            }
               
        });
      }
}
