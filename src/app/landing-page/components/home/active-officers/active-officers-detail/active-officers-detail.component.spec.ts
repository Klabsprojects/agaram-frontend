import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOfficersDetailComponent } from './active-officers-detail.component';

describe('ActiveOfficersDetailComponent', () => {
  let component: ActiveOfficersDetailComponent;
  let fixture: ComponentFixture<ActiveOfficersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveOfficersDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveOfficersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
