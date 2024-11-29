import { computed, Injectable, signal } from '@angular/core';
import { Objective, Problem } from '../../../../shared/types/objective';

@Injectable({
  providedIn: 'root',
})
export class ObjectiveService {
  private selectedObjectives = signal<Objective[]>([]);

  getSelectedObjectives() {
    return this.selectedObjectives.asReadonly();
  }

  readonly hasAtLeastOneProblem = computed(() =>
    this.selectedObjectives().some((objective) => objective.problems.length > 0)
  );

  setSelectedObjectives(objectives: Objective[]) {
    this.selectedObjectives.set(objectives);
  }

  addObjective(objective: Objective) {
    const current = this.selectedObjectives();
    const exists = current.find((obj) => obj.name === objective.name);
    if (!exists) {
      this.selectedObjectives.set([...current, objective]);
    }
  }

  addProblemToObjective(objectiveName: string, problem: Problem) {
    const updatedObjectives = this.selectedObjectives().map((objective) => {
      if (objective.name === objectiveName) {
        return {
          ...objective,
          problems: [...objective.problems, problem],
        };
      }
      return objective;
    });
    this.selectedObjectives.set(updatedObjectives);
  }

  getProblemsByObjective(objectiveName: string): Problem[] {
    const objective = this.selectedObjectives().find(
      (obj) => obj.name === objectiveName
    );
    return objective ? objective.problems : [];
  }

  removeObjective(objectiveName: string) {
    const updated = this.selectedObjectives().filter(
      (obj) => obj.name !== objectiveName
    );
    this.selectedObjectives.set(updated);
  }
}
