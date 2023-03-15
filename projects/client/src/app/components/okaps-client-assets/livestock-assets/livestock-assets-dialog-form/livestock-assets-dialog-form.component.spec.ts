import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivestockAssetsDialogFormComponent } from './livestock-assets-dialog-form.component';

describe('LivestockAssetsDialogFormComponent', () => {
  let component: LivestockAssetsDialogFormComponent;
  let fixture: ComponentFixture<LivestockAssetsDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivestockAssetsDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivestockAssetsDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
