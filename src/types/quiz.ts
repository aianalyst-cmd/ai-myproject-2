export type QuizQuestion = {
  question: string;
  choices: [string, string, string];
  correctIndex: number;
  explanation: string;
};

export type QuizRequestBody = {
  term: string;
  explanation: string;
};
