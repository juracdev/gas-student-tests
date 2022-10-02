const SETTINGS_SHEET_NAME = 'Настройки';

type InterTestSetting = {
  title: string;
  sheetId: string;
};

export function getInterTestSettings(): InterTestSetting[] {
  const settingsSheet =
    SpreadsheetApp.getActive().getSheetByName(SETTINGS_SHEET_NAME);

  const settingsValues = settingsSheet!.getDataRange().getValues().slice(1);

  return settingsValues.map(([title, sheetId]) => {
    const titleDate = Date.parse(title);
    const clearTitle = isNaN(titleDate)
      ? title
      : `${new Date(titleDate).toLocaleDateString()}`;

    return {
      title: clearTitle,
      sheetId,
    };
  });
}
