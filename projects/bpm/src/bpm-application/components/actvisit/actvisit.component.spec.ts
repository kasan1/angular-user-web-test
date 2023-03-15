import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActvisitComponent } from './actvisit.component';

describe('ActvisitComponent', () => {
  let component: ActvisitComponent;
  let fixture: ComponentFixture<ActvisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActvisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActvisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
