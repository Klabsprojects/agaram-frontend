import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementsComponent } from './retirements.component';

describe('RetirementsComponent', () => {
  let component: RetirementsComponent;
  let fixture: ComponentFixture<RetirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetirementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RetirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
