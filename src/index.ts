import { checkAnswers } from './checkAnswers';
import { getInterTestStats } from './inter-test-stats/getInterTestStats';
import { writeToCheckedSheet } from './writeToCheckedSheet';
import { writeToDocument } from './writeToDocument';

function main() {
  const checkedStudents = checkAnswers();
  writeToCheckedSheet(checkedStudents);
}

function createDocument() {
  const checkedStudents = checkAnswers();
  writeToDocument(checkedStudents);
}

function inter() {
  getInterTestStats();
}
