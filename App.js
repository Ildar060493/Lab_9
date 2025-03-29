import React, { useState } from 'react';
import { PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';  // Импортируем локализацию
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { withTiming } from 'react-native-reanimated';

// Инициализация базы данных и начальные данные
import { setupDatabase, seedDatabase } from './database/database';
setupDatabase();
seedDatabase();

// Пример экранов
import CompanyListScreen from './screens/CompanyListScreen';
import CompanyDetailScreen from './screens/CompanyDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      ...TransitionPresets.SlideFromRightIOS, // Стандартный слайд
      cardStyleInterpolator: ({ current }) => {
        return {
          cardStyle: {
            opacity: withTiming(current.progress, { duration: 300 }), // Плавная анимация
          },
        };
      },
    }}
  >
    <Stack.Screen name="CompanyList" component={CompanyListScreen} />
    <Stack.Screen name="CompanyDetail" component={CompanyDetailScreen} />
  </Stack.Navigator>
);

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Управление темной темой
  const { t } = useTranslation();  // Хук для перевода текста

  const currentTheme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
          <Text style={[styles.text, { color: currentTheme.colors.text }]}>
            {isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}
          </Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default App;
