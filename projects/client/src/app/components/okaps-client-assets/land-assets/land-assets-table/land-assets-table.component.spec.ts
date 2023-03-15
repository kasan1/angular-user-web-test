import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandAssetsTableComponent } from './land-assets-table.component';

describe('LandAssetsTableComponent', () => {
  let component: LandAssetsTableComponent;
  let fixture: ComponentFixture<LandAssetsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandAssetsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandAssetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
