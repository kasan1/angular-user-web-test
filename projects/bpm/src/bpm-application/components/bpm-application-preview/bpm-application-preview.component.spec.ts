import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationPreviewComponent } from './bpm-application-preview.component';

describe('BpmApplicationPreviewComponent', () => {
  let component: BpmApplicationPreviewComponent;
  let fixture: ComponentFixture<BpmApplicationPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
