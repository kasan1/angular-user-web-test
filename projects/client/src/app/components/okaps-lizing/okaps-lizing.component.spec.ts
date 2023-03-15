import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsLizingComponent } from './okaps-lizing.component';

describe('OkapsLizingComponent', () => {
  let component: OkapsLizingComponent;
  let fixture: ComponentFixture<OkapsLizingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsLizingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsLizingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
