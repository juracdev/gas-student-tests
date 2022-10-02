const ANSWERS_SHEET_NAME = 'Ответы на форму';

export function getStudentsData(sheetId?: string) {
  const answSheet = (
    sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActive()
  ).getSheetByName(ANSWERS_SHEET_NAME)!;

  return answSheet
    .getDataRange()
    .getValues()
    .slice(1)
    .map(([timestamp, firstname, lastname, ...other]) => {
      const answers = other.map((ans) => {
        ans = `${ans}`;
        const match = ans.match(/^[АБВГД]\)/i);
        console.log(ans, match);
        return match ? match[0].slice(0, 1) : ans;
      });

      return { name: `${lastname} ${firstname}`, answers };
    });
}
