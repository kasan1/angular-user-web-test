import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloraAssetsTableComponent } from './flora-assets-table.component';

describe('FloraAssetsTableComponent', () => {
  let component: FloraAssetsTableComponent;
  let fixture: ComponentFixture<FloraAssetsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloraAssetsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloraAssetsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
