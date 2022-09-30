import { getQuestionsData } from './getQuestionsData';
import { getStudentsData } from './getStudentsData';

type ChosenError = {
  number: number;
  questText: string;
  givenAns: string;
  correctAnsText: string;
};

type PhraseError = ChosenError & {
  foundKeys: string[];
  unfoundKeys: string[];
  isCorrectOrder: boolean;
};

export type CheckedStudent = {
  name: string;
  resultText: string;
  resultPerc: number;
  chosenErrors: ChosenError[];
  phraseErrors: PhraseError[];
};

type MatchKeyResult = { key: string; index: number };

function matchKey(answer: string, key: string): MatchKeyResult | null {
  const isMultipleKeys = /\[.+\]/.test(key);

  if (isMultipleKeys) {
    key = key.replace(/[\[\]]/g, '');
    const multiKeys = key.split('|').map((k) => k.trim());
    return multiKeys.reduce<MatchKeyResult | null>((acc, curr) => {
      return acc ? acc : matchKey(answer, curr);
    }, null);
  } else {
    const regExp = new RegExp(key, 'i');
    const match = answer.match(regExp);
    return match && typeof match.index === 'number'
      ? { key, index: match.index }
      : null;
  }
}

export function checkPhraseAnswer(answer, keys) {
  const foundKeys: string[] = [];
  const unfoundKeys: string[] = [];
  let lastFoundIdx = 0;
  let isCorrectOrder = true;

  answer = answer.trim();

  keys.forEach((key: string) => {
    const result = matchKey(answer, key);

    if (result) {
      foundKeys.push(key);
      if (result.index < lastFoundIdx) isCorrectOrder = false;
      lastFoundIdx = result.index;
    } else {
      unfoundKeys.push(key);
    }
  });
  return {
    foundKeys,
    unfoundKeys,
    isCorrectOrder,
  };
}

export function checkAnswers(): CheckedStudent[] {
  const questData = getQuestionsData();
  const studentsData = getStudentsData();

  const checkedStudents: CheckedStudent[] = [];

  studentsData.forEach(({ name, answers }) => {
    const checkedStudent: CheckedStudent = {
      name,
      chosenErrors: [],
      phraseErrors: [],
      resultPerc: 0,
      resultText: '',
    };

    answers.forEach((ans, idx) => {
      const quest = questData[idx];
      if (quest.isAnswerChosen) {
        if (ans !== quest.keys)
          checkedStudent.chosenErrors.push({
            number: quest.number,
            questText: quest.question,
            givenAns: ans,
            correctAnsText: quest.answer,
          });
      } else {
        const { foundKeys, unfoundKeys, isCorrectOrder } = checkPhraseAnswer(
          ans,
          quest.keys as string[]
        );
        const isOrderError = quest.isOrdered && !isCorrectOrder;
        if (unfoundKeys.length > 0 || isOrderError) {
          checkedStudent.phraseErrors.push({
            number: quest.number,
            questText: quest.question,
            givenAns: ans,
            correctAnsText: quest.answer,
            foundKeys,
            unfoundKeys,
            isCorrectOrder: isOrderError ? isCorrectOrder : true,
          });
        }
      }
    });

    const uncorrectAnsCount =
      checkedStudent.phraseErrors.length + checkedStudent.chosenErrors.length;
    const correctAnsCount = answers.length - uncorrectAnsCount;
    const perc = (correctAnsCount / answers.length).toFixed(3);

    checkedStudent.resultText = `${correctAnsCount} правильных из ${answers.length}`;
    checkedStudent.resultPerc = Number(perc);

    checkedStudents.push(checkedStudent);
  });

  return checkedStudents;
}