import { ParsedQuestion } from './parseTestQuestions';

export function generateTestForm(
  questions: ParsedQuestion[],
  formName: string
): GoogleAppsScript.Forms.Form {
  const form = FormApp.create(formName);

  questions.forEach((q) => {
    if (q.isChosen) {
      const chItem = form.addMultipleChoiceItem();
      const variants = q.chosenVariants!.map((v) => chItem.createChoice(v));
      chItem.setTitle(q.text).setChoices(variants).setRequired(true);
    } else {
      const pItem = form.addParagraphTextItem();
      pItem.setTitle(q.text).setRequired(true);
    }
  });

  return form;
}
