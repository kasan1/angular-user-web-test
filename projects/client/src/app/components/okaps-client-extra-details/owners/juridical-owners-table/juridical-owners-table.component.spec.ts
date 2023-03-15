import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuridicalOwnersTableComponent } from './juridical-owners-table.component';

describe('JuridicalOwnersTableComponent', () => {
  let component: JuridicalOwnersTableComponent;
  let fixture: ComponentFixture<JuridicalOwnersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuridicalOwnersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuridicalOwnersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
