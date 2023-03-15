import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmFileItemComponent } from './bpm-file-item.component';

describe('BpmFileItemComponent', () => {
  let component: BpmFileItemComponent;
  let fixture: ComponentFixture<BpmFileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmFileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmFileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
