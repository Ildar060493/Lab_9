import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('companies.db');

// Создание таблиц
export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );`
    );
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        founded_year INTEGER,
        ceo TEXT,
        industry TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES Categories(id)
      );`
    );
  });
};

// Заполнение БД начальными данными
export const seedDatabase = () => {
  const categories = [
    "Software & IT",
    "Hardware & Electronics",
    "Social Media & Internet Services",
    "E-commerce & Cloud Computing",
    "AI & Machine Learning"
  ];

  db.transaction(tx => {
    categories.forEach(category => {
      tx.executeSql(
        `INSERT OR IGNORE INTO Categories (name) VALUES (?);`,
        [category]
      );
    });
  });

  db.transaction(tx => {
    tx.executeSql("SELECT * FROM Categories;", [], (_, { rows }) => {
      const categoryMap = {};
      rows._array.forEach(row => {
        categoryMap[row.name] = row.id;
      });

      const companies = [
        ["Microsoft", "Крупная IT-компания, разработчик Windows, Office и Azure.", 1975, "Satya Nadella", "Software", categoryMap["Software & IT"]],
        ["Apple", "Производитель iPhone, MacBook и других устройств.", 1976, "Tim Cook", "Consumer Electronics", categoryMap["Hardware & Electronics"]],
        ["Google (Alphabet)", "Владелец поисковой системы Google, YouTube и Android.", 1998, "Sundar Pichai", "Internet", categoryMap["Social Media & Internet Services"]],
        ["Amazon", "Лидер в e-commerce и облачных вычислениях (AWS).", 1994, "Andy Jassy", "E-commerce", categoryMap["E-commerce & Cloud Computing"]],
        ["Meta (Facebook)", "Разработчик Facebook, Instagram, WhatsApp и метавселенной.", 2004, "Mark Zuckerberg", "Social Media", categoryMap["Social Media & Internet Services"]],
        ["Tesla", "Производитель электромобилей и технологий AI.", 2003, "Elon Musk", "Automotive & AI", categoryMap["AI & Machine Learning"]],
        ["NVIDIA", "Лидер в производстве видеокарт и чипов для AI.", 1993, "Jensen Huang", "Semiconductors", categoryMap["Hardware & Electronics"]],
        ["OpenAI", "Разработчик искусственного интеллекта, включая ChatGPT.", 2015, "Sam Altman", "AI Research", categoryMap["AI & Machine Learning"]],
        ["IBM", "Крупная IT-компания, работающая с AI, квантовыми вычислениями и облачными технологиями.", 1911, "Arvind Krishna", "Software & Consulting", categoryMap["Software & IT"]],
        ["Samsung", "Южнокорейский гигант в сфере электроники, чипов и смартфонов.", 1938, "Jong-Hee Han", "Electronics", categoryMap["Hardware & Electronics"]],
      ];

      companies.forEach(company => {
        tx.executeSql(
          `INSERT OR IGNORE INTO Companies (name, description, founded_year, ceo, industry, category_id)
           VALUES (?, ?, ?, ?, ?, ?);`,
          company
        );
      });
    });
  });
};

// Удаление компании по ID
export const deleteCompany = (companyId, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM Companies WHERE id = ?",
      [companyId],
      () => {
        callback(); // Успешное удаление
      },
      (tx, error) => {
        console.log("Ошибка удаления компании:", error);
        callback(); // Ошибка удаления, но вызываем callback для обработки
      }
    );
  });
};

