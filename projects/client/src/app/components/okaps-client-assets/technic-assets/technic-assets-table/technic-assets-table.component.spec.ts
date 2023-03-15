import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicAssetsTableComponent } from './technic-assets-table.component';

describe('TechnicAssetsTableComponent', () => {
  let component: TechnicAssetsTableComponent;
  let fixture: ComponentFixture<TechnicAssetsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicAssetsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicAssetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
