import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsLizingFormComponent } from './okaps-lizing-form.component';

describe('OkapsLizingFormComponent', () => {
  let component: OkapsLizingFormComponent;
  let fixture: ComponentFixture<OkapsLizingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsLizingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsLizingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
