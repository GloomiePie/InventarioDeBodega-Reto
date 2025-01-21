import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    NotiReport: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

// Define el tipo de los componentes
type Componente = {
    id: string;
    nombre: string;
    cantidad: number;
    limite: number;
    estado: 'Bien' | 'Defectuoso';
    codigo?: string; // Opcional, solo para los componentes defectuosos
    fecha: string; // Fecha en formato YYYY-MM-DD
    hora: string; // Hora en formato HH:mm
};

// Datos quemados
const componentes: Componente[] = [
    {
        id: '1',
        nombre: 'Hojas',
        cantidad: 30,
        limite: 50,
        estado: 'Bien',
        fecha: '2025-01-14',
        hora: '07:30',
    },
    {
        id: '2',
        nombre: 'Extintores',
        cantidad: 10,
        limite: 20,
        estado: 'Defectuoso',
        fecha: '2025-01-14',
        hora: '17:45',
    },
    {
        id: '3',
        nombre: 'Mesa',
        cantidad: 5,
        limite: 50,
        estado: 'Defectuoso',
        codigo: 'L213AS21',
        fecha: '2025-01-13',
        hora: '12:00',
    },
    {
        id: '4',
        nombre: 'Bolígrafos',
        cantidad: 5,
        limite: 10,
        estado: 'Bien',
        fecha: '2025-01-12',
        hora: '09:00',
    },
];

// Función para determinar el mensaje basado en la cantidad y el límite
const getMensajeEstado = (componente: Componente): string => {
    if (componente.estado === 'Defectuoso') {
        return `El componente ${componente.nombre} (${componente.codigo}) ha sido catalogado como defectuoso`;
    }

    if (componente.cantidad < componente.limite) {
        return `El componente ${componente.nombre} se encuentra por debajo del límite`;
    } else if (componente.cantidad > componente.limite) {
        return `El componente ${componente.nombre} está por encima del límite`;
    } else {
        return `El componente ${componente.nombre} está en su límite`;
    }
};

// Función para formatear la fecha de la notificación
const getDescripcionFecha = (fecha: string, hora: string): string => {
    const today = new Date();
    const fechaNotificacion = new Date(`${fecha}T${hora}`);

    const diferenciaDias = Math.floor((today.getTime() - fechaNotificacion.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
        return hora; // Muestra solo la hora si es el mismo día
    } else if (diferenciaDias === 1) {
        return 'Ayer';
    } else if (diferenciaDias === 2) {
        return 'Hace 2 días';
    } else {
        return fecha; // Devuelve la fecha en formato YYYY-MM-DD
    }
};

export default function App() {
    const navigation = useNavigation<NavigationProps>(); // Usar el hook para acceder a la navegación

    // Renderizar cada elemento de la lista
    const renderItem = ({ item }: { item: Componente }) => {
        const mensaje = getMensajeEstado(item);
        const isDefectuoso = item.estado === 'Defectuoso';
        const descripcionFecha = getDescripcionFecha(item.fecha, item.hora);

        return (
            <TouchableOpacity
                style={[styles.notificacion, isDefectuoso && styles.defectuoso]}
                disabled={!isDefectuoso}
                onPress={isDefectuoso ? () => navigation.navigate('NotiReport') : undefined}
            >
                <View style={styles.iconContainer}>
                    {isDefectuoso ? (
                        <MaterialCommunityIcons name="alarm-light-outline" size={24} color="#004270" />
                    ) : (
                        <FontAwesome5 name="box-open" size={24} color="#004270" />
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.mensaje}>{mensaje}</Text>
                    <Text style={styles.hora}>{descripcionFecha}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Notificaciones</Text>
            </View>
            <FlatList
                data={componentes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    header: {
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f8',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuIcon: {
        color: '#004B87',
        fontSize: 24,
        paddingRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
    },
    list: {
        padding: 16,
    },
    notificacion: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    defectuoso: {
        backgroundColor: '#e0e0e0',
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    mensaje: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 4,
    },
    hora: {
        fontSize: 14,
        color: '#666666',
    },
});
