import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredOfficersComponent } from './retired-officers.component';

describe('RetiredOfficersComponent', () => {
  let component: RetiredOfficersComponent;
  let fixture: ComponentFixture<RetiredOfficersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetiredOfficersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetiredOfficersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
