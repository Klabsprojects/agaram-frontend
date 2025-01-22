import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialEntriesComponent } from './special-entries.component';

describe('SpecialEntriesComponent', () => {
  let component: SpecialEntriesComponent;
  let fixture: ComponentFixture<SpecialEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpecialEntriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
