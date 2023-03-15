import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsClientDetailsComponent } from './okaps-client-details.component';

describe('OkapsClientDetailsComponent', () => {
  let component: OkapsClientDetailsComponent;
  let fixture: ComponentFixture<OkapsClientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsClientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
