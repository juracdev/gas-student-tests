export type ParsedAnswers = {
  [key: number]: string;
};

export function parseTestAnswers(
  body: GoogleAppsScript.Document.Body
): ParsedAnswers {
  const tables = body.getTables();
  const table = tables[0];
  const numRows = table.getNumRows() - 1;

  const answers: ParsedAnswers = {};

  for (let i = 1; i <= numRows; i++) {
    const row = table.getRow(i);

    answers[i] = row.getCell(1).asText().getText().trim();
    answers[i + numRows] = row.getCell(4).getText().trim();
  }

  return answers;
}
