import { checkAnswers } from './checkAnswers';
import { getInterTestStats } from './inter-test-stats/getInterTestStats';
import { writeInterStatsToSheet } from './inter-test-stats/writeInterStatsToSheet';
import { generateTest } from './test-creating/generateTest';
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

function writeInterTestStats() {
  const stats = getInterTestStats();
  writeInterStatsToSheet(stats);
}

function generateTestFromDoc() {
  generateTest();
}
