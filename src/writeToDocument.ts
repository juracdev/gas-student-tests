import { CheckedStudent } from './checkAnswers';

const RESULTS_FOLDER_ID = '1TI8n1U3fhpwMh7omCmWXDV5n4hHR-kg8';

export function writeToDocument(checkedStudents: CheckedStudent[]) {
  const dateTime = new Date().toISOString().split('.')[0];
  const docName = `Результаты теста ${dateTime}`;

  const doc = DocumentApp.create(docName);

  const body = doc.getBody();

  body.setAttributes({
    [DocumentApp.Attribute.FONT_FAMILY]: 'Roboto',
  });

  checkedStudents.forEach((student) => {
    body
      .appendParagraph(`${student.firstName} ${student.lastName}`)
      .setAttributes({
        [DocumentApp.Attribute.BOLD]: true,
      });

    body
      .appendParagraph(`Правильных ответов ${student.resultPercRound}%\n`)
      .setAttributes({
        [DocumentApp.Attribute.BOLD]: false,
      });

    if (student.chosenErrors.length > 0)
      body
        .appendParagraph('Ошибки в вопросах с вариантами ответа')
        .setAttributes({
          [DocumentApp.Attribute.BOLD]: true,
          [DocumentApp.Attribute.UNDERLINE]: true,
        });

    student.chosenErrors.forEach((err) => {
      body
        .appendParagraph(
          `Вопрос №${err.number}. ${err.questText}\nПравильный ответ: ${err.correctAnsText}\nДан ответ: ${err.givenAns}\n`
        )
        .setAttributes({
          [DocumentApp.Attribute.BOLD]: false,
          [DocumentApp.Attribute.UNDERLINE]: false,
        });
    });

    if (student.phraseErrors.length > 0)
      body
        .appendParagraph('Ошибки в вопросах с текстовым ответом')
        .setAttributes({
          [DocumentApp.Attribute.BOLD]: true,
          [DocumentApp.Attribute.UNDERLINE]: true,
        });

    student.phraseErrors.forEach((err) => {
      body
        .appendParagraph(
          `Вопрос №${err.number}. ${err.questText}\nПравильный ответ: ${
            err.correctAnsText
          }\nДан ответ: ${err.givenAns}\nНайденные ключи: ${err.foundKeys.join(
            ' '
          )}\nОтсутствующие ключи: ${err.unfoundKeys.join(' ')}${
            err.isCorrectOrder ? '' : '\nПорядок ключей неправильный!'
          }\n`
        )
        .setAttributes({
          [DocumentApp.Attribute.BOLD]: false,
          [DocumentApp.Attribute.UNDERLINE]: false,
        });
    });

    body.appendPageBreak();
  });

  const docFile = DriveApp.getFileById(doc.getId());
  DriveApp.getFolderById(RESULTS_FOLDER_ID).addFile(docFile);
  DriveApp.getRootFolder().removeFile(docFile);
}
