import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmInstantFileUploadComponent } from './bpm-instant-file-upload.component';

describe('BpmInstantFileUploadComponent', () => {
  let component: BpmInstantFileUploadComponent;
  let fixture: ComponentFixture<BpmInstantFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmInstantFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmInstantFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
