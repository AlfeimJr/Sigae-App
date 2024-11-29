import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { Subscription } from 'rxjs';
import { FormField, FormStep } from '../../../shared/types/form';
import { FormService } from '../../../core/services/form/form.service';
import { FormStateService } from '../../../core/services/form-state/form-state.service';
import { InputTextFloatComponent } from '../../../shared/components/input-text/input-text.component';
import { DropdownSelectComponent } from '../../../shared/components/dropdown-select/dropdown-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from '../../../core/services/people/people.service';
import { People } from '../../../shared/types/people';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'sigae-add-people',
  standalone: true,
  imports: [
    StepsModule,
    InputTextFloatComponent,
    DropdownSelectComponent,
    ReactiveFormsModule,
    SkeletonModule,
    ButtonModule,
  ],
  templateUrl: './add-people.component.html',
  styleUrl: './add-people.component.scss',
})
export class AddPeopleComponent implements OnInit {
  items: MenuItem[] | undefined;
  subscription: Subscription | undefined;
  active: number = 0;
  form: FormGroup;
  currentStep: number = 0;
  formSteps: FormStep[] = [];
  peopleId: string = '';
  isLoading: boolean = false;
  isCreating: boolean = false;
  private formFieldsService = inject(FormService);
  private formStateService = inject(FormStateService);
  private peopleService = inject(PeopleService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor(private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      steps: this.fb.array([]),
    });

    const savedState = this.formStateService.getFormState();
    if (savedState) {
      this.patchFormWithState(savedState);
    }
  }

  ngOnInit(): void {
    this.loadFormFields();
    this.items = [
      {
        label: 'Dados Cadastrais',
      },
      {
        label: 'Dados de contato',
      },
      {
        label: 'Dados de endereço',
      },
    ];
  }

  get steps(): FormArray {
    return this.form.get('steps') as FormArray;
  }

  loadFormFields() {
    this.isLoading = true;
    this.formFieldsService.getFormFields().subscribe({
      next: (response) => {
        this.formSteps = response.formFields;
        this.isLoading = false;
        this.initializeForm();
      },
      error: (err) => {
        console.error('Erro ao carregar os campos:', err);
      },
    });
  }

  initializeForm() {
    this.formSteps.forEach((step, stepIndex) => {
      const group = this.fb.group({});

      step.fields.forEach((field) => {
        const savedValue =
          this.formStateService.getFormState()?.[stepIndex]?.[field.name] || '';
        group.addControl(
          field.name,
          this.fb.control(
            savedValue,
            field.required ? Validators.required : null
          )
        );
      });

      this.steps.push(group);
    });
    const formState = localStorage.getItem('formState');
    if (formState) {
      let form = JSON.parse(formState);
      let people = Object.values(form);
      console.log('peopleId', people);

      this.steps.patchValue(Object.values(form));
    }
    this.form.valueChanges.subscribe(() => {
      this.updateFormStateService();
    });
  }

  private updateFormStateService() {
    const updatedState = this.steps.controls.map((group) => ({
      ...group.value,
    }));
    this.formStateService.updateFormState(updatedState);
  }

  nextStep() {
    if (this.currentStep < this.formSteps.length - 1) {
      this.currentStep++;
      this.active = this.currentStep;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.active = this.currentStep;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formStateService.updateFormState({});
    }
  }

  get formGroup(): FormGroup {
    return this.steps.at(this.currentStep) as FormGroup;
  }

  formControl(field: any): FormControl {
    return this.steps.at(this.currentStep).get(field.name) as FormControl;
  }

  private patchFormWithState(savedState: any) {
    if (!savedState.length) return;
    savedState.forEach((stepState: any, index: number) => {
      const group = this.steps.at(index) as FormGroup;
      if (group) {
        Object.keys(stepState).forEach((key) => {
          const control = group.get(key);
          if (control) {
            control.setValue(stepState[key], { emitEvent: false });
          }
        });
      }
    });
  }

  addTelephone() {
    const currentGroup = this.formGroup;
    const existingKeys = Object.keys(currentGroup.controls);
    const nextIndex = existingKeys.filter((key) =>
      key.startsWith('telefone')
    ).length;
    const newControlName = `telefone ${nextIndex + 1}`;

    currentGroup.addControl(
      newControlName,
      this.fb.control('', Validators.required)
    );
    this.formSteps[this.currentStep].fields.push({
      name: newControlName,
      type: 'text',
      required: false,
      label: ` Telefone ${nextIndex + 1}`,
      mask: '(00) 00000-0000',
      options: [],
    });
    this.cdr.detectChanges();
  }

  removeTelephone(telephoneName: string) {
    const currentGroup = this.formGroup;

    if (!currentGroup.contains(telephoneName)) return;

    this.removeControlFromGroup(currentGroup, telephoneName);

    this.removeFieldFromFormSteps(telephoneName);

    this.reorderTelephoneControls(currentGroup);
  }

  private removeControlFromGroup(group: FormGroup, controlName: string): void {
    group.removeControl(controlName);
  }

  private removeFieldFromFormSteps(fieldName: string): void {
    this.formSteps[this.currentStep].fields = this.formSteps[
      this.currentStep
    ].fields.filter((field) => field.name !== fieldName);
  }

  private reorderTelephoneControls(group: FormGroup): void {
    const remainingKeys = Object.keys(group.controls).filter((key) =>
      key.startsWith('telefone')
    );

    remainingKeys.sort().forEach((oldKey, index) => {
      const newKey = `telefone ${index + 1}`;
      if (oldKey !== newKey) {
        const control = group.get(oldKey);
        group.addControl(newKey, control!);
        group.removeControl(oldKey);

        this.updateFieldNameInFormSteps(oldKey, newKey, index + 1);
      }
    });
  }

  private updateFieldNameInFormSteps(
    oldName: string,
    newName: string,
    newIndex: number
  ): void {
    const fieldIndex = this.formSteps[this.currentStep].fields.findIndex(
      (field) => field.name === oldName
    );

    if (fieldIndex !== -1) {
      const field = this.formSteps[this.currentStep].fields[fieldIndex];
      field.name = newName;
      field.label = `Telefone ${newIndex}`;
    }
  }

  getFormControlKeys(group: FormGroup): string[] {
    return Object.keys(group.controls);
  }

  addPeople() {
    this.isCreating = true;
    this.activatedRoute.paramMap.subscribe((params) => {
      this.peopleId = params.get('id') as string;
    });
    this.peopleId ? this.editPeople() : this.createPeople();
  }

  createPeople() {
    this.peopleService.addPerson(this.form.value.steps).subscribe({
      next: (res) => {
        localStorage.removeItem('formState');
        this.steps.reset();
        this.updateFormStateService();
        this.router.navigateByUrl('/peoples');
        this.isCreating = false;
      },
    });
  }

  editPeople() {
    this.peopleService
      .patchPeople(this.form.value.steps, this.peopleId)
      .subscribe({
        next: (res) => {
          localStorage.removeItem('formState');
          this.steps.reset();
          this.updateFormStateService();
          this.router.navigateByUrl('/peoples');
          this.isCreating = false;
        },
      });
  }
}
