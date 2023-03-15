import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloraAssetsDialogFormComponent } from './flora-assets-dialog-form.component';

describe('FloraAssetsDialogFormComponent', () => {
  let component: FloraAssetsDialogFormComponent;
  let fixture: ComponentFixture<FloraAssetsDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloraAssetsDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloraAssetsDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
