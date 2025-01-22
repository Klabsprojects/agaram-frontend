import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerTourComponent } from './officer-tour.component';

describe('OfficerTourComponent', () => {
  let component: OfficerTourComponent;
  let fixture: ComponentFixture<OfficerTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficerTourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfficerTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
