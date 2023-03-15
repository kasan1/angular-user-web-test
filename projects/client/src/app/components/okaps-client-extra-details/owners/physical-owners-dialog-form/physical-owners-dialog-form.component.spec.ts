import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalOwnersDialogFormComponent } from './physical-owners-dialog-form.component';

describe('PhysicalOwnersDialogFormComponent', () => {
  let component: PhysicalOwnersDialogFormComponent;
  let fixture: ComponentFixture<PhysicalOwnersDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalOwnersDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalOwnersDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
