import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsApplicationComponent } from './okaps-application.component';

describe('OkapsApplicationComponent', () => {
  let component: OkapsApplicationComponent;
  let fixture: ComponentFixture<OkapsApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
