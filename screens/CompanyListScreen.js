import React, { useEffect, useState } from 'react';  
import { View, Text, FlatList, TouchableOpacity, TextInput, Picker, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getCompanies, getCategories, deleteCompany } from '../database/database'; // Импортируем функцию удаления
import { exportDataToJSON, importDataFromJSON } from '../database/dataManagement'; // Импортируем функции для импорта и экспорта
import { useSharedValue, withTiming, Animated } from 'react-native-reanimated';

const CompanyListScreen = ({ navigation }) => {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const opacity = useSharedValue(0);  // Добавляем состояние для анимации

  useEffect(() => {
    loadCompanies();
    loadCategories();

    // Анимация появления
    opacity.value = withTiming(1, { duration: 500 });
  }, [selectedCategory, search]);

  const loadCompanies = () => {
    setLoading(true);
    setError(null);
    getCompanies(setCompanies, selectedCategory, search)
      .catch((err) => {
        setError("Ошибка загрузки данных");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadCategories = () => {
    setLoading(true);
    getCategories(setCategories)
      .catch((err) => {
        setError("Ошибка загрузки категорий");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleDeleteCompany = (companyId) => {
    Alert.alert(
      "Удалить компанию",
      "Вы уверены, что хотите удалить эту компанию?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Удалить",
          onPress: () => {
            deleteCompany(companyId, () => {
              setCompanies(companies.filter(company => company.id !== companyId)); // Обновляем список после удаления
              Alert.alert("Успех", "Компания удалена");
            });
          }
        }
      ]
    );
  };

  // Функция для экспорта данных
  const handleExport = async () => {
    await exportDataToJSON(companies);
  };

  // Функция для импорта данных
  const handleImport = async () => {
    const importedData = await importDataFromJSON();
    setCompanies(importedData);
  };

  return (
    <Animated.View style={[styles.container, { opacity: opacity.value }]}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={handleSearchChange}
        placeholder="Поиск по названию"
      />

      <Picker
        selectedValue={selectedCategory}
        onValueChange={handleCategoryChange}
        style={styles.picker}
      >
        <Picker.Item label="Все категории" value={null} />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.name} value={category.id} />
        ))}
      </Picker>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CompanyDetails', { companyId: item.id })}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.industry}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCompany(item.id)}  // Вызов функции удаления
            >
              <Text style={styles.deleteButtonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CompanyForm')}
      >
        <Text style={styles.addButtonText}>+ Добавить компанию</Text>
      </TouchableOpacity>

      {/* Кнопки для импорта и экспорта данных */}
      <TouchableOpacity
        style={styles.exportButton}
        onPress={handleExport}
      >
        <Text style={styles.exportButtonText}>Экспортировать данные</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.importButton}
        onPress={handleImport}
      >
        <Text style={styles.importButtonText}>Импортировать данные</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CompanyListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff4c4c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  importButton: {
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


