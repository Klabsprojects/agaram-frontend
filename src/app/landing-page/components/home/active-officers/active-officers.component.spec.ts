import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOfficersComponent } from './active-officers.component';

describe('ActiveOfficersComponent', () => {
  let component: ActiveOfficersComponent;
  let fixture: ComponentFixture<ActiveOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveOfficersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
