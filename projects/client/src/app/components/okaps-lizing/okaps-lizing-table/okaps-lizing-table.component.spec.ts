import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsLizingTableComponent } from './okaps-lizing-table.component';

describe('OkapsLizingTableComponent', () => {
  let component: OkapsLizingTableComponent;
  let fixture: ComponentFixture<OkapsLizingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsLizingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsLizingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
