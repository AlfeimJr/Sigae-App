import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  Objective,
  Problem,
  ProblemAction,
} from '../../../../shared/types/objective';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { ObjectiveService } from '../../services/Objective/objective.service';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { CreateActionDialogComponent } from './create-action-dialog/create-action-dialog.component';

@Component({
  selector: 'sigae-step-three',
  templateUrl: './step-three.component.html',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    AccordionModule,
    CommonModule,
    DynamicDialogModule,
  ],
  providers: [DialogService],
  styleUrls: ['./step-three.component.scss'],
})
export class StepThreeComponent implements OnInit {
  objectives: Objective[] = [];
  expandedRows: { [key: string]: boolean } = {};
  problemExpandedRows: { [key: string]: boolean } = {};
  dialogRef: DynamicDialogRef | undefined;
  constructor(
    private objectiveService: ObjectiveService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.objectives = this.objectiveService.getSelectedObjectives()();
  }

  addAction(problem: Problem): void {
    this.dialogRef = this.dialogService.open(CreateActionDialogComponent, {
      header: 'Criar ação',
      width: '500px',
    });

    this.dialogRef.onClose.subscribe((actionData) => {
      if (actionData) {
        const newAction: ProblemAction = {
          description: actionData.description,
          step: 'Etapa 3',
          reponsability: actionData.responsibility.nome,
        };
        problem.actions = problem.actions || [];
        problem.actions.push(newAction);

        this.problemExpandedRows[problem.description] = true;
      }
    });
  }

  removeAction(problem: Problem, action: ProblemAction): void {
    problem.actions = problem.actions.filter((a) => a !== action);
  }
}
