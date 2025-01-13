import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConsumptionStandardsFormComponent } from './consumption-standards-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConsumptionStandardsFormComponent', () => {
     let component: ConsumptionStandardsFormComponent;
     let fixture: ComponentFixture<ConsumptionStandardsFormComponent>;

     beforeEach(async () => {
          await TestBed.configureTestingModule({
               imports: [
                    FormsModule,
                    ReactiveFormsModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                    NoopAnimationsModule,
               ],
               declarations: [ConsumptionStandardsFormComponent],
          }).compileComponents();

          fixture = TestBed.createComponent(ConsumptionStandardsFormComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
     });

     it('should create', () => {
          expect(component).toBeTruthy();
     });
});
