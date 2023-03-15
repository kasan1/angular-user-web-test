import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsApplicationSignComponent } from './okaps-application-sign.component';

describe('OkapsApplicationSignComponent', () => {
  let component: OkapsApplicationSignComponent;
  let fixture: ComponentFixture<OkapsApplicationSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsApplicationSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsApplicationSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
