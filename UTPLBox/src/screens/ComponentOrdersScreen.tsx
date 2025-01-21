import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const imageMap: { [key: string]: any } = {
    markers: require('../assets/example/markers.png'),
    extinguisher: require('../assets/example/extinguisher.png'),
    tablet: require('../assets/example/tablet.png'),

};

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    StateComp: undefined;
    ReportComp: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export default function App() {
    const navigation = useNavigation<NavigationProps>();

    // Datos quemados
    const pedidos = [
        { id: '1', nombre: 'José Pérez', componente: 'Marcadores', estado: 'Recibido', imagen: 'markers' },
        { id: '2', nombre: 'Fabián Reyes', componente: 'Hojas a cuadros', estado: 'Rechazado', imagen: 'extinguisher' },
        { id: '3', nombre: 'Ethan Jara', componente: 'Tablets', estado: 'Aceptada', imagen: 'tablet' },
        { id: '4', nombre: 'José Bustamante', componente: 'Mesa circular', estado: 'Recibido', imagen: 'ball' }
    ];

    // Función que maneja la navegación según el estado del pedido
    const handleNavigation = (estado: string) => {
        if (estado === 'Aceptada' || estado === 'Rechazado') {
            navigation.navigate('StateComp'); // Ruta editable
        } else if (estado === 'Recibido') {
            navigation.navigate('ReportComp'); // Ruta editable
        }
    };

    // Función para renderizar cada pedido
    const renderPedido = ({ item }: { item: typeof pedidos[0] }) => (
        <TouchableOpacity onPress={() => handleNavigation(item.estado)}>
            <View style={styles.card}>
                <Image source={imageMap[item.imagen]} style={styles.avatar} />
                <View style={styles.infoContainer}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>¡Nueva solicitud!</Text>
                        <Text
                            style={[
                                styles.estado,
                                item.estado === 'Aceptada'
                                    ? styles.aceptada
                                    : item.estado === 'Rechazado'
                                        ? styles.rechazada
                                        : styles.recibida
                            ]}
                        >
                            {item.estado}
                        </Text>
                    </View>
                    <Text style={styles.subtitle}>{`${item.nombre} ha creado una nueva solicitud para el componente ${item.componente}`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header2}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title2}>Pedidos Pendientes</Text>
            </View>
            <FlatList
                data={pedidos}
                renderItem={renderPedido}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16
    },
    header2: {
        paddingTop: 50,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f8',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    menuIcon: {
        color: '#004B87',
        fontSize: 24,
        paddingRight: 50
    },
    title2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        paddingLeft: 20
    },
    listContainer: {
        paddingBottom: 16
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 20
    },
    infoContainer: {
        flex: 1
    },
    title: {
        fontSize: 16,
        color: '#004270'
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'justify'
    },
    estado: {
        fontWeight: "bold",
        fontSize: 14,
        textDecorationLine: 'underline'
    },
    aceptada: {
        color: '#2aca30'
    },
    recibida: {
        color: '#febe10'
    },
    rechazada: {
        color: 'red'
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    }
});


