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
    const exists = current.find((obj) => obj.id === objective.id);
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

  updateObjective(updatedObjective: Objective): void {
    const current = this.selectedObjectives();
    const index = current.findIndex((obj) => obj.id === updatedObjective.id);

    if (index === -1) {
      throw new Error(
        `O objetivo "${updatedObjective.name}" não foi encontrado.`
      );
    }
    const newObjectives = [...current];
    newObjectives[index] = { ...newObjectives[index], ...updatedObjective };
    this.selectedObjectives.set(newObjectives);
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
