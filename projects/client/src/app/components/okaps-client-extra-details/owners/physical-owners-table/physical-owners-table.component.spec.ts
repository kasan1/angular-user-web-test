import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalOwnersTableComponent } from './physical-owners-table.component';

describe('PhysicalOwnersTableComponent', () => {
  let component: PhysicalOwnersTableComponent;
  let fixture: ComponentFixture<PhysicalOwnersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalOwnersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalOwnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
