import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesseurFormComponent } from './professeur-form.component';

describe('ProfesseurFormComponent', () => {
  let component: ProfesseurFormComponent;
  let fixture: ComponentFixture<ProfesseurFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesseurFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesseurFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
