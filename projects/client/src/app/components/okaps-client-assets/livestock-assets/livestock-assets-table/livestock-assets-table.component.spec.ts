import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivestockAssetsTableComponent } from './livestock-assets-table.component';

describe('LivestockAssetsTableComponent', () => {
  let component: LivestockAssetsTableComponent;
  let fixture: ComponentFixture<LivestockAssetsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivestockAssetsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivestockAssetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
