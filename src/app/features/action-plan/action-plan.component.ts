import { Component, effect, signal, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { StepOneComponent } from './steps-action-plan/step-one/step-one.component';
import { StepTwoComponent } from './steps-action-plan/step-two/step-two.component';
import { StepThreeComponent } from './steps-action-plan/step-three/step-three.component';
import { ObjectiveService } from './services/Objective/objective.service';
import { Objective } from '../../shared/types/objective';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'sigae-action-plan',
  standalone: true,
  imports: [
    ButtonModule,
    StepperModule,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    CommonModule,
  ],
  templateUrl: './action-plan.component.html',
  styleUrl: './action-plan.component.scss',
})
export class ActionPlanComponent {
  objectives: Signal<Objective[]>;
  isNextEnabled: boolean = false;
  hasAtLeastOneProblem = false;
  constructor(private objectiveService: ObjectiveService) {
    this.objectives = this.objectiveService.getSelectedObjectives();
    effect(() => {
      const objectives = this.objectives();
      this.isNextEnabled =
        objectives.length > 0 && this.checkRequiredFields(objectives);
    });
  }

  private checkRequiredFields(objectives: Objective[]): boolean {
    return objectives.every(
      (objective) =>
        objective.name &&
        objective.problems.every(
          (problem) => problem.description && problem.step && problem.hasCause
        )
    );
  }

  get existProblems(): boolean {
    return this.objectives().some((objective) => objective.problems.length > 0);
  }
}
