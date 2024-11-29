import { Component, effect, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { InputTextFloatComponent } from '../../../../shared/components/input-text/input-text.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { Objective } from '../../../../shared/types/objective';
import { ObjectiveService } from '../../services/Objective/objective.service';

@Component({
  selector: 'sigae-step-one',
  templateUrl: './step-one.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, InputTextModule, CheckboxModule],
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnInit {
  planForm: FormGroup;
  selectedObjectivesSignal = signal<Objective[]>([]);
  constructor(
    private fb: FormBuilder,
    private objectiveService: ObjectiveService
  ) {
    this.planForm = this.fb.group({
      planDescription: ['Plano 1', Validators.required],
      objectives: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadObjectives();
  }

  get objectives(): FormArray {
    return this.planForm.get('objectives') as FormArray;
  }

  loadObjectives(): void {
    const initialObjectives = [
      { name: 'Objetivo 1', selected: false },
      { name: 'Objetivo 2', selected: false },
      { name: 'Objetivo 3', selected: false },
    ];

    initialObjectives.forEach((objective) => {
      this.objectives.push(
        this.fb.group({
          name: [objective.name, Validators.required],
          selected: [objective.selected],
          problems: this.fb.array([]),
        })
      );
    });
  }
  getSelectedObjectives(): Objective[] {
    return this.objectives.controls
      .filter((control) => control.get('selected')?.value)
      .map((control) => ({
        name: control.get('name')?.value,
        selected: control.get('selected')?.value,
        problems: control.get('problems')?.value,
      }));
  }

  getFormControl(index: number, name: string): any {
    return this.objectives.at(index).get(name) as FormControl;
  }

  onCheckboxChange(index: number): void {
    const control = this.objectives.at(index) as FormGroup;
    const selected = control.get('selected')?.value;
    const name = control.get('name')?.value;

    if (selected) {
      this.objectiveService.addObjective({ name, selected, problems: [] });
    } else {
      this.objectiveService.removeObjective(name);
    }
  }
}