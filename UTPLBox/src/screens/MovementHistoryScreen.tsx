import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
  };
  
  // Tipar el hook de navegación
  type NavigationProps = DrawerNavigationProp<DrawerParamList>;
  

// Datos quemados para "Últimos Movimientos"
const ultimosMovimientos = [
    {
        id: '1',
        descripcion: 'Se agregó 20 unidades a marcadores líquidos modificado por Pablo Reyes',
        fecha: '2024-12-27',
        tipo: 'agregado',
        hora: '21:10',
    },
    {
        id: '2',
        descripcion: 'Se retiró 2 unidades a mesa circular modificado por Pedro Gonzales',
        fecha: '2024-09-04',
        tipo: 'retirado',
        hora: '8:45',
    },
    {
        id: '3',
        descripcion: 'Se agregó 3 unidades a extintores modificado por Leonardo Chuquimarca',
        fecha: '2024-12-04',
        tipo: 'agregado',
        hora: '13:00',
    },
    {
        id: '4',
        descripcion: 'Se agregó 15 unidades a bolígrafos modificado por Israel Torres',
        fecha: '2025-01-07',
        tipo: 'agregado',
        hora: '8:45',
    },
    {
        id: '5',
        descripcion: 'Se retiró 9 unidades a tablets modificado por Pedro Gonzales',
        fecha: '2024-09-04',
        tipo: 'retirado',
        hora: '8:45',
    },
];

// Función para verificar si una fecha es "ayer"
const esAyer = (fecha: string): boolean => {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaMovimiento = new Date(anio, mes - 1, dia);

    return (
        fechaMovimiento.getFullYear() === ayer.getFullYear() &&
        fechaMovimiento.getMonth() === ayer.getMonth() &&
        fechaMovimiento.getDate() === ayer.getDate()
    );
};

// Componente de ícono dinámico
const MovimientoIcono = ({ tipo }: { tipo: string }) => {
    return (
        <MaterialCommunityIcons
            name={tipo === 'agregado' ? 'arrow-up' : 'arrow-down'}
            size={24}
            color={tipo === 'agregado' ? 'green' : 'red'}
        />
    );
};

// Render de cada ítem en la lista
const renderMovimiento = ({ item }: { item: typeof ultimosMovimientos[0] }) => (
    <View style={styles.itemContainer}>
        <MovimientoIcono tipo={item.tipo} />
        <View style={styles.textContainer}>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.fecha}>
                {esAyer(item.fecha) ? 'Ayer' : item.fecha} - {item.hora}
            </Text>
        </View>
    </View>
);

export default function App() {
    const navigation = useNavigation<NavigationProps>();// Usar el hook para acceder a la navegación

    return (
        <View style={styles.container}>
            <View style={styles.header} >
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Historial De Movimientos</Text>

            </View>
            <FlatList
                data={ultimosMovimientos}
                renderItem={renderMovimiento}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
        padding: 10,
    },
    header: {
        paddingTop: 50,
        flexDirection: 'row', // Alinear elementos horizontalmente
        alignItems: 'center', // Centrar elementos verticalmente
        backgroundColor: '#f4f4f8',
        paddingHorizontal: 16,
        paddingVertical: 12,
        textAlign: 'center',
    },
    menuIcon: {
        color: '#004B87',
        fontSize: 24,
        paddingRight: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: '#003366',
    },
    listContainer: {
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    descripcion: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    fecha: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});
