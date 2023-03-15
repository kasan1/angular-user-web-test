import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsClientExtraDetailsComponent } from './okaps-client-extra-details.component';

describe('OkapsClientExtraDetailsComponent', () => {
  let component: OkapsClientExtraDetailsComponent;
  let fixture: ComponentFixture<OkapsClientExtraDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsClientExtraDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsClientExtraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
