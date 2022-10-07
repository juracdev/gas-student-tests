function isTextChosenVarian(text: string): boolean {
  return Boolean(text.match(/^[АБВГД]\)/i));
}

export type ParsedQuestion = {
  num: number;
  isChosen: boolean;
  text: string;
  chosenVariants?: string[];
};

export function parseTestQuestions(
  body: GoogleAppsScript.Document.Body
): ParsedQuestion[] {
  let qNumber = 1;
  let findRange: GoogleAppsScript.Document.RangeElement | null = null;

  const questions: ParsedQuestion[] = [];

  do {
    findRange = body.findText(`^${qNumber}\\.`);

    if (findRange === null) {
      console.log(`Закончили на ${qNumber - 1} вопросе`);
      break;
    }

    const el = findRange.getElement();

    const qtext = el
      .asText()
      .getText()
      .trim()
      .replace(/\s{2,}/gi, ' ');

    let sibling = el.getParent().getNextSibling();
    let siblText = sibling.asText().getText();
    const question: ParsedQuestion = {
      num: qNumber,
      text: qtext,
      isChosen: false,
    };

    if (isTextChosenVarian(siblText)) {
      question.isChosen = true;
      question.chosenVariants = [siblText];

      let siblIsVarian = true;
      do {
        sibling = sibling.getNextSibling();
        siblText = sibling.asText().getText();
        if (isTextChosenVarian(siblText)) {
          question.chosenVariants.push(siblText);
        } else {
          siblIsVarian = false;
        }
      } while (siblIsVarian === true);
    }

    questions.push(question);

    qNumber++;
  } while (true);

  return questions;
}
