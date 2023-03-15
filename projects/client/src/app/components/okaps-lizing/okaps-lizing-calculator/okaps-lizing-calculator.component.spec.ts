import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsLizingCalculatorComponent } from './okaps-lizing-calculator.component';

describe('OkapsLizingCalculatorComponent', () => {
  let component: OkapsLizingCalculatorComponent;
  let fixture: ComponentFixture<OkapsLizingCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsLizingCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsLizingCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
