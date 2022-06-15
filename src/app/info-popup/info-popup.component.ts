import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent implements OnInit {

  jiraPoint: any;

  constructor(
    public dialogRef: MatDialogRef<InfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.jiraPoint = data['jiraPoint'];
  }

  ngOnInit(): void {
  }

}
