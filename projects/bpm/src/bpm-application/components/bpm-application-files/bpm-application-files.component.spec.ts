import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationFilesComponent } from './bpm-application-files.component';

describe('BpmApplicationFilesComponent', () => {
  let component: BpmApplicationFilesComponent;
  let fixture: ComponentFixture<BpmApplicationFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
