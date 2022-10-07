import { generateAnswersSheet } from './generateAnswersSheet';
import { generateTestForm } from './generateTestForm';
import { parseTestAnswers } from './parseTestAnswers';
import { parseTestQuestions } from './parseTestQuestions';

export function generateTest() {
  const setSheet = SpreadsheetApp.getActive().getSheetByName('Настройки')!;
  const setValues = setSheet!.getDataRange().getValues().slice(1)[0];

  const formName = setValues[0].trim()
    ? setValues[0].trim()
    : `Созданный тест ${new Date().toISOString()}`;
  const sourceID = setValues[1];
  const resultDirId = setValues[2];

  const doc = DocumentApp.openById(sourceID);
  const body = doc.getBody();

  const questions = parseTestQuestions(body);
  const form = generateTestForm(questions, formName);

  const answers = parseTestAnswers(body);
  const ss = generateAnswersSheet(questions, answers, formName);

  const formFile = DriveApp.getFileById(form.getId());
  const ssFile = DriveApp.getFileById(ss.getId());
  DriveApp.getFolderById(resultDirId).addFile(formFile).addFile(ssFile);
  DriveApp.getRootFolder().removeFile(formFile).removeFile(ssFile);
}
