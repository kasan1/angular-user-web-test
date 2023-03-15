import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmFileUploadBaseComponent } from './bpm-file-upload-base.component';

describe('BpmFileUploadBaseComponent', () => {
  let component: BpmFileUploadBaseComponent;
  let fixture: ComponentFixture<BpmFileUploadBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmFileUploadBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmFileUploadBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
