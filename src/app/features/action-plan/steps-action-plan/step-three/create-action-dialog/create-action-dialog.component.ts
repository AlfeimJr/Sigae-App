import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PeopleService } from '../../../../../core/services/people/people.service';
import { DropdownSelectComponent } from '../../../../../shared/components/dropdown-select/dropdown-select.component';
import { People } from '../../../../../shared/types/people';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'sigae-create-action-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownSelectComponent,
    DropdownModule,
  ],
  templateUrl: './create-action-dialog.component.html',
  styleUrl: './create-action-dialog.component.scss',
})
export class CreateActionDialogComponent {
  actionForm: FormGroup;
  peopleService = inject(PeopleService);
  peoples: People[] = [];
  constructor(private fb: FormBuilder, public ref: DynamicDialogRef) {
    this.actionForm = this.fb.group({
      description: ['', Validators.required],
      responsibility: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPeoples();
  }

  submit(): void {
    if (this.actionForm.valid) {
      this.ref.close(this.actionForm.value);
    }
  }

  getPeoples() {
    this.peopleService.getPeople().subscribe({
      next: (res) => {
        this.peoples = res.people;
      },
    });
  }

  getFormControl(name: string) {
    return this.actionForm.get(name) as FormControl;
  }
}
