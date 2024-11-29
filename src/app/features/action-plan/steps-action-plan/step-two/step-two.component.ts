import { Component, OnInit, Signal, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Objective, Problem } from '../../../../shared/types/objective';
import { ObjectiveService } from '../../services/Objective/objective.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'sigae-step-two',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
})
export class StepTwoComponent implements OnInit {
  problemForm: FormGroup;
  objectivesSignal: Signal<Objective[]> = signal([]);
  priorities = ['Alta', 'Média', 'Baixa'];
  categories = ['Categoria 1', 'Categoria 2', 'Categoria 3'];
  steps = ['Etapa 1', 'Etapa 2', 'Etapa 3'];
  hasCause = ['Sim', 'Não'];
  objectives: Objective[] = [];
  constructor(
    private fb: FormBuilder,
    private objectiveService: ObjectiveService
  ) {
    this.problemForm = this.fb.group({
      description: ['', Validators.required],
      step: ['', Validators.required],
      hasCause: ['', Validators.required],
      result: ['', Validators.required],
      priority: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.objectives = this.objectiveService.getSelectedObjectives()();
  }

  addProblem(objectiveName: string): void {
    if (this.problemForm.valid) {
      const problem: Problem = this.problemForm.value;
      this.objectiveService.addProblemToObjective(objectiveName, problem);
      this.problemForm.reset();
    }
  }

  getProblems(objectiveName: string): Problem[] {
    return this.objectiveService.getProblemsByObjective(objectiveName);
  }
}
