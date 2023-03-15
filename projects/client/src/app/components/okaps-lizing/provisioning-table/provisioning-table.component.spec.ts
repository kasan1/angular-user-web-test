import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisioningTableComponent } from './provisioning-table.component';

describe('ProvisioningTableComponent', () => {
  let component: ProvisioningTableComponent;
  let fixture: ComponentFixture<ProvisioningTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisioningTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisioningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
