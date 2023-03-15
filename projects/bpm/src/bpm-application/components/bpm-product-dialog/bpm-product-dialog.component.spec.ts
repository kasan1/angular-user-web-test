import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmProductDialogComponent } from './bpm-product-dialog.component';

describe('BpmProductDialogComponent', () => {
  let component: BpmProductDialogComponent;
  let fixture: ComponentFixture<BpmProductDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmProductDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
