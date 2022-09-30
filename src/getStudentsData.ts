export function getStudentsData() {
  const answSheet =
    SpreadsheetApp.getActive().getSheetByName('Ответы на форму')!;

  return answSheet
    .getDataRange()
    .getValues()
    .slice(1)
    .map(([timestamp, firstname, lastname, ...other]) => {
      const answers = other.map((ans) => {
        ans = `${ans}`;
        const match = ans.match(/^[АБВГД]\)/i);
        return match ? match[0].slice(0, 1) : ans;
      });

      return { name: `${lastname} ${firstname}`, answers };
    });
}
