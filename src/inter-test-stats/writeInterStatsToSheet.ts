import { getInterTestSettings } from './getInterTestSettings';
import { StudentsInterStat } from './getInterTestStats';

const OUTPUT_SHEET_NAME = 'Результат';

export function writeInterStatsToSheet(interStat: StudentsInterStat) {
  const outputSheet =
    SpreadsheetApp.getActive().getSheetByName(OUTPUT_SHEET_NAME)!;

  outputSheet.getRange('A:Z').clearContent();

  const lastNames = Object.keys(interStat).sort();
  const settings = getInterTestSettings();
  const FIRST_ROW = 2;
  let currentRow = FIRST_ROW;

  const titles = settings.map(({ title }) => title);
  const headers = titles.concat(titles.map((t) => `${t}, ошибки`));

  const columnsTypeOffset = titles.length;

  outputSheet.getRange(1, 1).setValue('Фамилия');
  outputSheet.getRange(1, 2, 1, headers.length).setValues([headers]);

  lastNames.forEach((lastName) => {
    const capName = `${lastName.slice(0, 1).toUpperCase()}${lastName
      .slice(1)
      .toLowerCase()}`;
    outputSheet.getRange(currentRow, 1).setValue(capName);
    settings.forEach(({ title }, testIdx) => {
      const testResult = interStat[lastName].find((x) => x.title === title);
      const studentPerc = testResult ? `${testResult.perc}%` : '-';
      const studentInvalidAmount = testResult
        ? testResult.invalidAnsAmount
        : '-';
      outputSheet.getRange(currentRow, testIdx + 2).setValue(studentPerc);
      outputSheet
        .getRange(currentRow, testIdx + 2 + columnsTypeOffset)
        .setValue(studentInvalidAmount);
    });
    currentRow++;
  });
}
