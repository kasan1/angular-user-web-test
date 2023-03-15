import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmApplicationFilesSettingsComponent } from './bpm-application-files-settings.component';

describe('BpmApplicationFilesSettingsComponent', () => {
  let component: BpmApplicationFilesSettingsComponent;
  let fixture: ComponentFixture<BpmApplicationFilesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmApplicationFilesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmApplicationFilesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
