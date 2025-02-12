import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpUpdatesComponent } from './imp-updates.component';

describe('ImpUpdatesComponent', () => {
  let component: ImpUpdatesComponent;
  let fixture: ComponentFixture<ImpUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImpUpdatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImpUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
