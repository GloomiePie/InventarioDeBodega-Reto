import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

// Importa tus pantallas
import HomeScreen from '../screens/HomeScreen';

// Define los tipos de las rutas
export type DrawerParamList = {
  Home: undefined; // Si necesitas parámetros, indícalos aquí
  Profile: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
