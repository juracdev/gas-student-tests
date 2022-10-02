import { CheckedStudent } from './checkAnswers';
import { PERCENT_TO_SUCCESS } from './constants';

export function writeToCheckedSheet(checkedStudents: CheckedStudent[]) {
  const FIRST_ROW = 2;
  const checkedSheet =
    SpreadsheetApp.getActive().getSheetByName('Проверенные')!;

  checkedSheet.getRange('A2:E').clearContent().setBackground('white');

  let currentRow = FIRST_ROW;

  checkedStudents.forEach((student) => {
    checkedSheet
      .getRange(currentRow, 1)
      .setValue(`${student.firstName} ${student.lastName}`);

    const percentCell = checkedSheet.getRange(currentRow, 2);
    percentCell.setValue(`${student.resultPercRound}`);

    if (student.resultPercRound >= PERCENT_TO_SUCCESS)
      percentCell.setBackground('#97f0bb');

    checkedSheet
      .getRange(currentRow, 3)
      .setValue(
        `${student.correctAnsAmount} правильных из ${
          student.correctAnsAmount + student.invalidAnsAmount
        } ответов, ${student.resultPerc}`
      );

    const errorsChosenText = student.chosenErrors
      .map(({ number, questText, correctAnsText, givenAns }, idx) => {
        let text = idx === 0 ? '' : '\n';
        text += `Вопрос №${number}. ${questText}\nПравильный ответ: ${correctAnsText}\nДан ответ: ${givenAns}`;
        return text;
      })
      .join('\n');

    checkedSheet.getRange(currentRow, 4).setValue(errorsChosenText);

    const errorsPhraseText = student.phraseErrors
      .map(
        (
          {
            number,
            questText,
            correctAnsText,
            givenAns,
            foundKeys,
            unfoundKeys,
            isCorrectOrder,
          },
          idx
        ) => {
          let text = idx === 0 ? '' : '\n';
          text += `Вопрос №${number}. ${questText}\nПравильный ответ: ${correctAnsText}\nДан ответ: ${givenAns}\nНайденные ключи: ${foundKeys.join(
            ' '
          )}\nОтсутствующие ключи: ${unfoundKeys.join(' ')}${
            isCorrectOrder ? '' : '\nПорядок ключей неправильный!'
          }`;
          return text;
        }
      )
      .join('\n');

    checkedSheet.getRange(currentRow, 5).setValue(errorsPhraseText);

    currentRow++;
  });
}
