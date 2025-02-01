import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonRetirementComponent } from './person-retirement.component';

describe('PersonRetirementComponent', () => {
  let component: PersonRetirementComponent;
  let fixture: ComponentFixture<PersonRetirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonRetirementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonRetirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
