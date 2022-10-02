type QuestionData = {
  number: number;
  question: string;
  answer: string;
  keys: string | string[];
  isOrdered: boolean;
};

export function getQuestionsData(sheetId?: string): QuestionData[] {
  const questSheet = (
    sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActive()
  ).getSheetByName('Вопросы');
  const values = questSheet!.getDataRange().getValues().slice(1);

  return values.map(([number, question, answer, key, isOrderedStr]) => {
    key = `${key}`;
    answer = `${answer}`;
    const isChoosen = Boolean(answer.match(/^[АБВГД]\)/i));
    return {
      number,
      question,
      answer,
      keys: isChoosen ? key : key.split(',').map((k) => k.trim()),
      isOrdered: isOrderedStr.toLowerCase() === 'да' ? true : false,
    };
  });
}
