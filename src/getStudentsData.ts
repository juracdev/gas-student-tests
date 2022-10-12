const ANSWERS_SHEET_NAME = 'Ответы на форму';

type StudentData = {
  firstName: string;
  lastName: string;
  answers: StudentAnswer[];
};

type StudentAnswer = {
  answerText: string;
  isChoosen: boolean;
  choosenVariant?: string;
};

export function getStudentsData(sheetId?: string): StudentData[] {
  const answSheet = (
    sheetId ? SpreadsheetApp.openById(sheetId) : SpreadsheetApp.getActive()
  ).getSheetByName(ANSWERS_SHEET_NAME)!;

  return answSheet
    .getDataRange()
    .getValues()
    .slice(1)
    .map(([timestamp, lastName, firstName, ...other]) => {
      const answers: StudentAnswer[] = other.map((ans: string) => {
        ans = `${ans}`;
        const match = ans.match(/^[АБВГДЕ]\)/i);
        const isChoosen = Boolean(match);
        return {
          answerText: ans,
          isChoosen,
          choosenVariant: isChoosen ? match![0].slice(0, 1) : undefined,
        };
      });

      return { firstName, lastName, answers };
    });
}
