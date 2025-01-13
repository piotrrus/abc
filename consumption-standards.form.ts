import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ConsumptionStandard } from '@features/consumption-standards/models/consumption-standards.model';

export class ConsumptionStandardsForm {
     public form: FormGroup = this.createFormsArray();

     constructor(private fb: FormBuilder) {}

     public get itemsArray(): FormArray {
          return this.form.get('items') as FormArray;
     }

     public createForm(data?: ConsumptionStandard): FormGroup {
          return this.fb.group({
               id: [{ value: data?.id }],
               consumpion_standard: [data?.consumpion_standard, []],
               name: [data?.name],
          });
     }

     public getItemsControls(): AbstractControl[] {
          return (this.form.get('items') as FormArray).controls;
     }

     private createFormsArray(): FormGroup {
          return (this.form = this.fb.group({
               items: new FormArray([]),
          }));
     }
}
