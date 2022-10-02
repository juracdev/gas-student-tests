import { checkAnswers } from '../checkAnswers';

const SETTINGS_SHEET_NAME = 'Настройки';

export function getInterTestStats() {
  const settingsSheet =
    SpreadsheetApp.getActive().getSheetByName(SETTINGS_SHEET_NAME);

  const settingsValues = settingsSheet!.getDataRange().getValues().slice(1);

  settingsValues.forEach(([name, id]) => {
    const testResult = checkAnswers(id);

    // console.log(name);
    // console.log(testResult);
  });
}
