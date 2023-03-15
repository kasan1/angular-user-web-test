import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuridicalOwnersDialogFormComponent } from './juridical-owners-dialog-form.component';

describe('JuridicalOwnersDialogFormComponent', () => {
  let component: JuridicalOwnersDialogFormComponent;
  let fixture: ComponentFixture<JuridicalOwnersDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuridicalOwnersDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuridicalOwnersDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
