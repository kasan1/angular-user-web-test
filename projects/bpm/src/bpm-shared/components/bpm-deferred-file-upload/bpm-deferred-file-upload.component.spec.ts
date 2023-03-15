import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmDeferredFileUploadComponent } from './bpm-deferred-file-upload.component';

describe('BpmDeferredFileUploadComponent', () => {
  let component: BpmDeferredFileUploadComponent;
  let fixture: ComponentFixture<BpmDeferredFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmDeferredFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmDeferredFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
