import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export default function InformeSolicitud() {
    const navigation = useNavigation<NavigationProps>();

    // Funciones para obtener los datos
    const getNombre = () => 'José Pérez';
    const getCantidad = () => 30;
    const getTelefono = () => '+593 555 555 5555';
    const getFecha = () => '23/01/2024';
    const getEstado = () => 'Pendiente';
    const getObservaciones = () =>
        'Los marcadores que se encontraban en el inventario se agotaron y se necesita su reposición';

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Informe de Solicitud</Text>
            </View>

            {/* Título de la solicitud */}
            <Text style={styles.subTitle}>Marcadores Líquidos</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Información general */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información general</Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Emitido Por: </Text>
                        {getNombre()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Cantidad a Adquirir: </Text>
                        {getCantidad()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Teléfono de Contacto: </Text>
                        {getTelefono()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Fecha de Solicitud: </Text>
                        {getFecha()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Estado de Solicitud: </Text>
                        {getEstado()}
                    </Text>
                </View>

                {/* Observaciones */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Observaciones</Text>
                    <View style={styles.observationsContainer}>
                        <Text style={styles.observationsText}>
                            {getObservaciones()}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>Regresar al inicio</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
        paddingRight: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
    },
    subTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#003366',
    },
    scrollContainer: {
        paddingBottom: 16,
    },
    section: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
        paddingVertical: 7,
        backgroundColor: '#c2cede',
        fontSize: 16,
        marginBottom: 10,
        color: '#003366',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
    },
    label: {
        fontWeight: 'bold',
    },
    observationsContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CCC',
        minHeight: 100,
    },
    observationsText: {
        fontSize: 14,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingBottom: 20,
        marginBottom: 50,
    },
    rejectButton: {
        backgroundColor: '#f2b705',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
        margin: 5,
    },
    acceptButton: {
        backgroundColor: '#003366',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
        margin: 5,
    },
    buttonText: {
        color: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        height: '45%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        marginHorizontal: 0, // Sin márgenes laterales
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#003366',
        marginVertical: 15,
    },
    modalButton: {
        backgroundColor: '#003366',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },
    modalIcon: {
        paddingVertical: 30,
    }
});
