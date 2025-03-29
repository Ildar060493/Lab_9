import RNFS from 'react-native-fs';

// Функция для экспорта данных в JSON файл
export const exportDataToJSON = async (data) => {
  try {
    const path = RNFS.DocumentDirectoryPath + '/companiesData.json';
    await RNFS.writeFile(path, JSON.stringify(data), 'utf8');
    console.log('Данные успешно экспортированы в:', path);
  } catch (error) {
    console.error('Ошибка при экспорте данных:', error);
  }
};

// Функция для импорта данных из JSON файла
export const importDataFromJSON = async () => {
  try {
    const path = RNFS.DocumentDirectoryPath + '/companiesData.json';
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      const data = await RNFS.readFile(path, 'utf8');
      return JSON.parse(data); // Возвращаем данные в виде объекта
    } else {
      console.log('Файл не найден');
      return [];
    }
  } catch (error) {
    console.error('Ошибка при импорте данных:', error);
    return [];
  }
};
