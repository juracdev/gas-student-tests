import { checkAnswers } from '../checkAnswers';
import { getInterTestSettings } from './getInterTestSettings';

export type StudentsInterStat = {
  [key: string]: InterTestResult[];
};

type InterTestResult = {
  title: string;
  perc: number;
  invalidAnsAmount: number;
};

export function getInterTestStats(): StudentsInterStat {
  const settings = getInterTestSettings();

  const interStat: StudentsInterStat = {};

  settings.forEach(({ title, sheetId }) => {
    const testResults = checkAnswers(sheetId);

    if (Object.keys(interStat).length === 0) {
      testResults.forEach(({ lastName }) => {
        interStat[lastName.toLowerCase().trim()] = [];
      });
    }

    testResults.forEach((tr) => {
      const lastName = tr.lastName.toLowerCase().trim();
      if (interStat[lastName]) {
        interStat[lastName].push({
          title,
          perc: tr.resultPercRound,
          invalidAnsAmount: tr.invalidAnsAmount,
        });
      } else {
        console.log(`NOT FOUND ${lastName}`);
        interStat[lastName.toLowerCase().trim()] = [
          {
            title,
            perc: tr.resultPercRound,
            invalidAnsAmount: tr.invalidAnsAmount,
          },
        ];
      }
    });
  });

  return interStat;
}
