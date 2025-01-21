import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Pressable, Modal, Dimensions, Animated, Easing
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigationState, useFocusEffect } from '@react-navigation/native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RecoverPasswordScreen from './src/screens/RecoverPasswordScreen';
import MovementHistoryScreen from './src/screens/MovementHistoryScreen';
import ComponentsScreen from './src/screens/ComponentsScreen'
import InventoryComponent from './src/screens/InventoryComponentIScreen';
import AuditoryScreen from './src/screens/AuditoryScreen';
import ComponentOrdersScreen from './src/screens/ComponentOrdersScreen';
import ReportComponentScreen from './src/screens/ReportComponentScreen';
import ReportComponentStateScreen from './src/screens/ReportComponentStateScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import NotificationReportScreen from './src/screens/NotificationReportScreen';
import { BarcodeScannerScreen } from './src/screens/BarcodeScannerScreen';
import AddComponentScreen from './src/screens/AddComponent';
import { StateScannerScreen } from "./src/screens/StateScannerScreen";
import VerifyStateComponentScreen from './src/screens/VerifyStateComponentScreen';

import { BarcodeProvider } from './src/screens/BarcodeContext/BarcodeContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer
const CustomDrawerContent = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  useFocusEffect(
    React.useCallback(() => {
        // Esta función se ejecuta al enfocar la pantalla
        return () => {
            // Esta función se ejecuta al desenfocar la pantalla
            setModalVisible(false); // Cerrar el modal
        };
    }, [])
  );

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalPosition = useRef(new Animated.Value(300)).current;

  const handleOpenModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1, // Oscurecer el fondo
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(modalPosition, {
        toValue: 0, // Mover la notificación a su posición visible
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(modalPosition, {
        toValue: 300,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };


  const DrawerItem = ({ label, icon, onPress }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.drawerItem,
        pressed && { backgroundColor: '#ededed' },
      ]}
      onPress={onPress}
    >
      {icon}
      <Text style={styles.drawerLabel}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Carlos Morocho Carrión</Text>
        <Text style={styles.profileRole}>Personal Administrativo</Text>
      </View>

      {/* Opciones de navegación */}
      <View style={styles.drawerItemsContainer}>
        <DrawerItem
          label="Inicio"
          icon={<Feather name="home" size={24} color="#004170" />}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label="Componentes"
          icon={<FontAwesome6 name="boxes-stacked" size={24} color="#004170" />}
          onPress={() => props.navigation.navigate('Components')}
        />
        <DrawerItem
          label="Estado del Componente"
          icon={(
            <FontAwesome name="check-circle" size={24} color="#004270" />
          )}
          onPress={handleOpenModal} // Abre el modal al hacer clic
        />
        <DrawerItem
          label="Pedidos de Componente"
          icon={<Feather name="file-text" size={24} color="#004170" />}
          onPress={() => props.navigation.navigate('OrderComp')}
        />
        <DrawerItem
          label="Movimientos"
          icon={<MaterialCommunityIcons name="history" size={24} color="#004170" />}
          onPress={() => props.navigation.navigate('History')}
        />
        <DrawerItem
          label="Auditorías"
          icon={<FontAwesome5 name="calendar-alt" size={24} color="#004170" />}
          onPress={() => props.navigation.navigate('Auditory')}
        />

      </View>

      {/* Botón de cerrar sesión */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
          <MaterialCommunityIcons name="logout" size={20} color="#f54b64" />
        </TouchableOpacity>
        <Text style={styles.versionText}>V1.01.0</Text>
      </View>

      {/* Modal */}
      {modalVisible && (
        <View style={StyleSheet.absoluteFillObject}>
          {/* Fondo oscuro animado */}
          <Animated.View
            style={[
              styles.modalOverlay,
              {
                opacity: overlayOpacity,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            ]}
          >
            <TouchableOpacity style={styles.overlayTouchable} onPress={handleCloseModal} />
          </Animated.View>

          {/* Notificación */}
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalPosition }],
              },
            ]}
          >
            <Text style={styles.modalTitle}>
              ¡POR FAVOR ESCANEA EL CÓDIGO DE BARRAS!
            </Text>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={80}
              color="#004270"
              style={styles.barcodeIcon2}
            />
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                setModalVisible(false); // Cierra el modal
                props.navigation.navigate('StateScanner'); // Navega a StateScanner
              }}
            >
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

    </View>
  );
};
// Configuración del Drawer Navigator
const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="History" component={MovementHistoryScreen} />
      <Drawer.Screen name="Components" component={ComponentsScreen} />
      <Drawer.Screen name="InvComponent" component={InventoryComponent} />
      <Drawer.Screen name="Auditory" component={AuditoryScreen} />
      <Drawer.Screen name="OrderComp" component={ComponentOrdersScreen} />
      <Drawer.Screen name="ReportComp" component={ReportComponentScreen} />
      <Drawer.Screen name="StateComp" component={ReportComponentStateScreen} />
      <Drawer.Screen name="Noti" component={NotificationScreen} />
      <Drawer.Screen name="NotiReport" component={NotificationReportScreen} />

      <Drawer.Screen name="Barcode" component={BarcodeScannerScreen} />
      <Drawer.Screen name="AddComp" component={AddComponentScreen} />

      <Drawer.Screen name="StateScanner" component={StateScannerScreen} />
      <Drawer.Screen name="VerifyState" component={VerifyStateComponentScreen} />
    </Drawer.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <BarcodeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </BarcodeProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004170',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
  },
  drawerItemsContainer: {
    flex: 1,
    marginTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  drawerLabel: {
    marginLeft: 15,
    fontSize: 16,
    color: '#004170',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fbe4e6',
  },
  logoutText: {
    flex: 1,
    color: '#f54b64',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    height: height,
    paddingTop: 50,
    justifyContent: "flex-end", // Posiciona el modal en la parte inferior
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
    zIndex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    zIndex: 2,
  },

  modalText: {
    fontSize: 25,
    color: '#004270',
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#004270',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 20,
  },
  icon: {
    padding: 20
  },
  overlayTouchable: {
    flex: 1,
    width: width,
    height: height,
  },
  modalTitle: {
    paddingTop: 50,
    marginHorizontal: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#004270",
    marginBottom: 10,
    textAlign: "center",
  },
  barcodeIcon2: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  acceptButton: {
    backgroundColor: '#004270',
    padding: 10,
    marginBottom: 50,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});