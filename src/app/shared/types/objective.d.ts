export type Problem = {
  description: string;
  step: string;
  hasCause: boolean;
  result?: string;
  priority: string;
  category?: string;
  actions: ProblemAction[];
};

export type Objective = {
  name: string;
  selected: boolean;
  problems: Problem[];
};

export type ProblemAction = {
  description: string;
  step: string;
  reponsability: string;
};
