type QuestionData = {
  number: number;
  question: string;
  answer: string;
  isAnswerChosen: boolean;
  keys: string | string[];
  isOrdered: boolean;
};

const CHOSEN_ANS_KEYS = ['А', 'Б', 'В', 'Г', 'Д'];

function checkIsAnswerChosen(ans: string) {
  return ans.length === 1 && CHOSEN_ANS_KEYS.includes(ans.toUpperCase());
}

export function getQuestionsData(sheetId?: string): QuestionData[] {
  const questSheet = (
    sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActive()
  ).getSheetByName('Вопросы');
  const values = questSheet!.getDataRange().getValues().slice(1);

  return values.map(([number, question, answer, key, isOrderedStr]) => {
    key = `${key}`;
    const isAnswerChosen = checkIsAnswerChosen(key);
    return {
      number,
      question,
      answer,
      isAnswerChosen,
      keys: isAnswerChosen ? key : key.split(',').map((k) => k.trim()),
      isOrdered: isOrderedStr.toLowerCase() === 'да' ? true : false,
    };
  });
}
