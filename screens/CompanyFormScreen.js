import React, { useState } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addCompany, updateCompany } from '../database/database';

const CompanyFormScreen = ({ route, navigation }) => {
  const { company } = route.params || {}; // Если редактируем, получаем компанию из параметров
  const [name, setName] = useState(company?.name || '');
  const [description, setDescription] = useState(company?.description || '');
  const [foundedYear, setFoundedYear] = useState(company?.founded_year?.toString() || '');
  const [ceo, setCeo] = useState(company?.ceo || '');
  const [industry, setIndustry] = useState(company?.industry || '');

  const handleSubmit = () => {
    // Проверка на обязательные поля
    if (!name || !foundedYear || !industry) {
      Alert.alert('Ошибка', 'Название, год основания и индустрия обязательны!');
      return;
    }

    // Обновление или добавление компании в базу данных
    if (company) {
      updateCompany(company.id, name, description, foundedYear, ceo, industry, () => {
        Alert.alert('Успех', 'Компания обновлена!');
        navigation.goBack();  // Возврат к предыдущему экрану после успешного обновления
      });
    } else {
      addCompany(name, description, foundedYear, ceo, industry, () => {
        Alert.alert('Успех', 'Компания добавлена!');
        navigation.goBack();  // Возврат к предыдущему экрану после успешного добавления
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Название компании</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Описание</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Год основания</Text>
      <TextInput style={styles.input} value={foundedYear} onChangeText={setFoundedYear} keyboardType="numeric" />

      <Text style={styles.label}>CEO</Text>
      <TextInput style={styles.input} value={ceo} onChangeText={setCeo} />

      <Text style={styles.label}>Индустрия</Text>
      <TextInput style={styles.input} value={industry} onChangeText={setIndustry} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{company ? 'Обновить' : 'Добавить'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompanyFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
