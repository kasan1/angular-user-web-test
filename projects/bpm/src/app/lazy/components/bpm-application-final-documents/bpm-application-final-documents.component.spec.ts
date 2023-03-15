import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationFinalDocumentsComponent } from './bpm-application-final-documents.component';

describe('BpmApplicationFinalDocumentsComponent', () => {
  let component: BpmApplicationFinalDocumentsComponent;
  let fixture: ComponentFixture<BpmApplicationFinalDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationFinalDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationFinalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
