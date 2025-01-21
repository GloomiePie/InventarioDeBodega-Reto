import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    FlatList,
    Image,
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useBarcode } from './BarcodeContext/BarcodeContext'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
    Components: undefined;
    Barcode: undefined;
    StateScanner: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export function AddComponentScreen() {
    const navigation = useNavigation<NavigationProps>();

    // Estados para los datos del formulario
    const { barcode, setBarcode } = useBarcode();
    const [quantity, setQuantity] = useState(10);
    const [componentName] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedInventoryType, setSelectedInventoryType] = useState<string | null>(null);
    const [inventoryType, setInventoryType] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    useFocusEffect(
        useCallback(() => {
            // Restablece otros estados pero NO reinicia el código de barras
            setSelectedInventoryType(null); // Inicializa como null
            setDescription('');
            setSelectedImage(null);

            // Opcional: Lógica para actualizar la interfaz
            return () => {
                // Limpieza si es necesario
            };
        }, [])
    );


    const closeModal = () => {
        setModalVisible(false);
        navigation.goBack(); // Redirige al usuario después de cerrar el modal (opcional)
    };


    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const selectInventoryType = (type: string) => {
        setSelectedInventoryType(type);
        setDropdownVisible(false);
    };

    const inventoryTypes = [
        "Perfecto estado",
        "Buen estado (Usado)",
        "Defectuoso",
        "Obsoleto",
    ];


    // Función para procesar los datos
    const processBarcode = (barcode: string) => {
        return barcode.toUpperCase();
    };

    const processDescription = (description: string) => {
        return description.trim() || 'Sin descripción';
    };

    const handleSave = () => {
        if (!barcode.trim() || !selectedInventoryType || selectedInventoryType === "Selecciona el estado del producto") {
            Alert.alert('Error', 'Seleccione el estado del componente.');
            return;
        }

        const processedData = {
            barcode: processBarcode(barcode),
            inventoryType: selectedInventoryType,
            description: processDescription(description),
            image: selectedImage,
        };

        console.log('Datos procesados:', processedData);
        setModalVisible(true); // Abre el modal
    };



    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para almacenar la imagen seleccionada

    // Función para abrir la galería
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la galería');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Actualiza el estado con la URI de la imagen seleccionada
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Encabezado */}
            <View style={styles.header2}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title2}>Verificación Estado del Componente</Text>
            </View>

            {/* Formulario */}
            <View style={styles.cont}>
                <Text style={styles.label2}>AGREGAR EVIDENCIA EN CASO DE ENCONTRAR ALGÚN DESPERFECTO</Text>
                <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.image} />
                    ) : (
                        <MaterialCommunityIcons name="image-plus" size={100} color="#004270" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Campo de Código de Barras */}
            <Text style={styles.label}>Código de Barras</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    value={barcode} // Muestra el valor del contexto
                    onChangeText={setBarcode} // Permite modificarlo manualmente
                />
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => navigation.navigate('StateScanner')} // Navega a la pantalla de escaneo
                >
                    <Text style={styles.scanButtonText}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row2}>
                <Text style={styles.label3}>Estado del Componente</Text>

                <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                    <Text style={styles.dropdownButtonText}>
                        {selectedInventoryType || "Selecciona el estado del producto"}
                    </Text>
                </TouchableOpacity>
                {isDropdownVisible && (
                    <View style={styles.dropdownContainer}>
                        <FlatList
                            data={inventoryTypes}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => selectInventoryType(item)} style={styles.dropdownItem}>
                                    <Text style={styles.dropdownItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </View>

            <Text style={styles.label}>En caso de que tenga algún desperfecto detallelo (Opcional)</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                placeholder="Escriba el defecto encontrado..."
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
            {modalVisible && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>ESTADO DEL COMPONENTE VERIFICADO</Text>
                            <AntDesign name="checkcircle" size={100} color="#004270" style={styles.modalIcon} />
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('Home')
                                }}
                            >
                                <Text style={styles.modalButtonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header2: {
        paddingTop: 50,
        flexDirection: 'row', // Alinear elementos horizontalmente
        alignItems: 'center', // Centrar elementos verticalmente
        paddingHorizontal: 25,
        paddingVertical: 12,
        textAlign: 'center',
    },
    menuIcon: {
        color: '#004B87',
        fontSize: 24,
        paddingRight: 50,
    },
    title2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#003366',
    },
    label2: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#003366',
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#003366',
    },
    imagePlaceholder: {
        height: 150,
        width: 150,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: "28%",
        marginBottom: 16,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 8,
    },
    imagePlaceholderText: {
        fontSize: 40,
        color: '#007AFF',
    },
    cont: {
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
    },
    scanButton: {
        marginLeft: 8,
        backgroundColor: '#004270',
        padding: 8,
        borderRadius: 8,
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 20,
    },
    quantityButton: {
        backgroundColor: '#004270',
        padding: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
    },
    textArea: {
        height: 50,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#004270',
        padding: 12,
        marginTop: 30,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
        backgroundColor: "white",
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "white",
        marginTop: 4,
    },
    dropdownItem: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    dropdownItemText: {
        fontSize: 16,
    },
    row2: {
        marginBottom: 16,
    },
    label3: {
        fontSize: 16,
        marginBottom: 8,
        color: "#004270",
        fontWeight: "bold"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#004270',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalIcon: {
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#004270',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default AddComponentScreen;
