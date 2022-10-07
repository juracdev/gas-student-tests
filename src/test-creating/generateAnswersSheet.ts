import { ParsedAnswers } from './parseTestAnswers';
import { ParsedQuestion } from './parseTestQuestions';

export function generateAnswersSheet(
  questions: ParsedQuestion[],
  answers: ParsedAnswers,
  formName: string
): GoogleAppsScript.Spreadsheet.Spreadsheet {
  const ss = SpreadsheetApp.create(`${formName} (Ответы)`);
  const answSheet = ss.insertSheet();
  answSheet.setName('Вопросы');

  answSheet
    .getRange(1, 1, 1, 5)
    .setValues([
      [
        'Номер',
        'Вопрос',
        'Правильный ответ',
        'Ключи',
        'Проверять порядок ключей',
      ],
    ]);

  const FIRST_ROW = 2;
  questions.forEach((q, idx) => {
    let ans = answers[q.num];
    let fullAnswer = ans;

    if (q.isChosen) {
      const findedVar = q.chosenVariants?.find((v) => {
        return new RegExp(`^${ans}\\)`, 'i').test(v);
      });
      fullAnswer = findedVar || fullAnswer;
    }

    answSheet
      .getRange(FIRST_ROW + idx, 1, 1, 4)
      .setValues([
        [
          q.num,
          q.text.replace(/^\d*\./, '').trim(),
          fullAnswer,
          q.isChosen ? ans : '',
        ],
      ]);
  });

  return ss;
}
