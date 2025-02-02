import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteeManagementComponent } from './invitee-management.component';

describe('InviteeManagementComponent', () => {
  let component: InviteeManagementComponent;
  let fixture: ComponentFixture<InviteeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
