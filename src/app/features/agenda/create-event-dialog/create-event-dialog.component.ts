import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextFloatComponent } from '../../../shared/components/input-text/input-text.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'sigae-create-event-dialog',
  standalone: true,
  imports: [
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputTextFloatComponent,
  ],
  templateUrl: './create-event-dialog.component.html',
  styleUrl: './create-event-dialog.component.scss',
})
export class CreateEventDialogComponent implements OnInit {
  eventForm: FormGroup;
  fields: EventField[] = [
    {
      name: 'title',
      label: 'Titulo',
      type: 'text',
      placeholder: 'Título do evento',
      required: true,
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      placeholder: 'Descrição',
      required: true,
    },
    {
      name: 'color',
      label: 'Cor',
      type: 'dropdown',
      placeholder: 'Cor',
      options: [
        { label: 'Vermelho', value: 'red' },
        { label: 'Azul', value: 'blue' },
        { label: 'Verde', value: 'green' },
      ],
      required: true,
    },
    {
      name: 'startDate',
      label: 'Data de Inicio',
      type: 'datetime',
      placeholder: 'Data de Inicio',
      required: true,
    },
    {
      name: 'endDate',
      label: 'Data de Fim',
      type: 'datetime',
      placeholder: 'Data de Fim',
      required: true,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit() {
    const data = this.config.data;
    if (data) {
      this.eventForm.patchValue({
        title: data.title || '',
        startDate: data.startDate || '',
        description: data.description || '',
        endDate: data.endDate || '',
        color: data.color || '',
      });
    }
  }

  createForm(): FormGroup {
    const group: any = {};
    this.fields.forEach((field) => {
      group[field.name] = field.required ? [null, Validators.required] : [null];
    });
    return this.fb.group(group);
  }

  addEvent() {
    this.ref.close(this.eventForm.value);
  }
}
