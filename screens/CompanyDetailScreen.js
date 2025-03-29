import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { deleteCompany } from '../database/database';

const CompanyDetailScreen = ({ route, navigation }) => {
  const { company } = route.params;

  const handleDelete = () => {
    Alert.alert('Удаление', 'Вы уверены, что хотите удалить эту компанию?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        onPress: () => {
          deleteCompany(company.id, () => {
            Alert.alert('Удалено', 'Компания успешно удалена.');
            navigation.goBack();
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{company.name}</Text>
      <Text style={styles.description}>{company.description}</Text>
      <Text style={styles.info}>Год основания: {company.founded_year}</Text>
      <Text style={styles.info}>CEO: {company.ceo}</Text>
      <Text style={styles.info}>Индустрия: {company.industry}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={() => navigation.navigate('CompanyForm', { company })}
        >
          <Text style={styles.buttonText}>Редактировать</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CompanyDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
