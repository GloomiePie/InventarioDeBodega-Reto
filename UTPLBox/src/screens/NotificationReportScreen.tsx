import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import { Componente } from './NotificationScreen';
import { Componente as Componente2} from './VerifyStateComponentScreen';
import { FlatList } from 'react-native-gesture-handler';


// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;


export default function InformeEstado() {
    const navigation = useNavigation<NavigationProps>();

    const route = useRoute();
    const { componente } = route.params as { componente: Componente };

    // Funciones para obtener los datos
    const getCodigoBarra = () => componente.codigo || 'N/A';
    const getCantidad = () => componente.cantidad.toString();
    const getEstado = () => componente.estado;
    const getFecha = () => componente.fecha;
    const getImage = JSON.parse(componente.image); 
    const getObservaciones = () => componente.descripcion;

    return (
        <View style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Informe de Estado</Text>
            </View>

            {/* Título del componente */}
            <Text style={styles.subTitle}>{componente.nombre}</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Información general */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información general</Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Código de barra: </Text>
                        {getCodigoBarra()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Cantidad: </Text>
                        {getCantidad()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Estado del componente: </Text>
                        {getEstado()}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Fecha: </Text>
                        {getFecha()}
                    </Text>
                </View>

                {/* Evidencia */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Evidencia</Text>
                    <FlatList 
                    data={getImage} // Pasa las imágenes como data
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }} // Asegura que cada imagen sea usada como source
                            style={styles.evidenceImage}
                            resizeMode="cover"
                        />
                    )}
                    scrollEnabled={false}
                />
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
                    <Text style={styles.buttonText}>Regresar al Inicio</Text>
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
    },
    scrollContainer: {
        paddingBottom: 16,
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 16,
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
        marginBottom: 15,
        color: '#000',
    },
    label: {
        fontWeight: 'bold',
    },
    evidenceImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginVertical: 7,
    },
    observationsContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
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
    },
    acceptButton: {
        backgroundColor: '#003366',
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
    },
});

