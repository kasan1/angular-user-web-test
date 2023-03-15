import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
@Component({
  selector: 'app-bpm-admin-home',
  templateUrl: './bpm-admin-home.component.html',
  styleUrls: ['./bpm-admin-home.component.scss']
})
export class BpmAdminHomeComponent implements OnInit {
  form;
  constructor() { }

  ngOnInit(): void {
  }

}
