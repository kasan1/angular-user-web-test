import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkapsClientAssetsComponent } from './okaps-client-assets.component';

describe('OkapsClientAssetsComponent', () => {
  let component: OkapsClientAssetsComponent;
  let fixture: ComponentFixture<OkapsClientAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OkapsClientAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkapsClientAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
