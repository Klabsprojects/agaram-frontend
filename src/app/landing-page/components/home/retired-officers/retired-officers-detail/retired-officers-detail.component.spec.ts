import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredOfficersDetailComponent } from './retired-officers-detail.component';

describe('RetiredOfficersDetailComponent', () => {
  let component: RetiredOfficersDetailComponent;
  let fixture: ComponentFixture<RetiredOfficersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetiredOfficersDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetiredOfficersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
