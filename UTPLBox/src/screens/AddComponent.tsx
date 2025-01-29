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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
    Components: undefined;
    Barcode: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export function AddComponentScreen() {
    const navigation = useNavigation<NavigationProps>();

    // Estados para los datos del formulario
    const { barcode, setBarcode } = useBarcode();
    const [quantity, setQuantity] = useState(10);
    const [componentName, setComponentName] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedInventoryType, setSelectedInventoryType] = useState("Suministros de Oficina");
    const [inventoryType, setInventoryType] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal

    useFocusEffect(
        useCallback(() => {
            // Evitar resetear estados innecesarios
            setComponentName('');
            setDescription('');
            setSelectedImage(null);
            // Omitir resetear selectedInventoryType si afecta funcionalidad
            return () => {
                // Limpieza si es necesario
            };
        }, [])
    );


    const closeModal = () => {
        setModalVisible(false);
        navigation.goBack(); // Redirige al usuario después de cerrar el modal (opcional)
    };


    const toggleDropdown = useCallback(() => {
        setDropdownVisible(prev => !prev);
    }, []);

    const selectInventoryType = useCallback((type: string) => {
        setSelectedInventoryType(type);
        setDropdownVisible(false);
    }, []);

    const inventoryTypes = [
        "Suministros de Oficina",
        "Equipos y Mobiliarios",
        "Tecnología",
        "Material Deportivo",
        "Limpieza y Seguridad",
        "Libros y material Bibliográfico",
        "Material Educativo",
    ];


    // Función para procesar los datos
    const processBarcode = (barcode: string) => {
        return barcode.toUpperCase();
    };

    const processQuantity = (quantity: number) => {
        return quantity > 0 ? quantity : 1;
    };

    const processDescription = (description: string) => {
        return description.trim() || 'Sin descripción';
    };

    const handleSave = async () => {
        if (
            !componentName.trim() ||
            !barcode.trim() ||
            !description.trim() ||
            !quantity ||
            !selectedInventoryType ||
            !selectedImage
        ) {
            Alert.alert('Error', 'Todos los campos, incluida la imagen, son obligatorios. Por favor, complételos antes de guardar.');
            return;
        }

        const processedData = {
            id: new Date().toISOString(),
            barcode: processBarcode(barcode),
            quantity: processQuantity(quantity),
            name: componentName.trim(),
            category: selectedInventoryType,
            description: processDescription(description),
            image: selectedImage,
        };

        try {
            // Obtener la lista existente
            const existingData = await AsyncStorage.getItem('components');
            const components = existingData ? JSON.parse(existingData) : [];
    
            // Agregar el nuevo componente
            const updatedComponents = [...components, processedData];
    
            // Guardar en AsyncStorage
            await AsyncStorage.setItem('components', JSON.stringify(updatedComponents));
    
            console.log('Datos procesados y guardados:', processedData);
            setModalVisible(true); // Abre el modal
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            Alert.alert('Error', 'No se pudo guardar el componente. Intente nuevamente.');
        }
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
                <Text style={styles.title2}>Agregar Componente</Text>
            </View>

            {/* Campo para escribir el nombre del componente */}
            <Text style={styles.label}>Nombre del Componente</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingrese el nombre del componente"
                value={componentName}
                onChangeText={setComponentName}
            />
            {/* Formulario */}
            <View style={styles.cont}>
                <Text style={styles.label2}>Agregar imagen</Text>
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
                    onPress={() => navigation.navigate('Barcode')} // Navega a la pantalla de escaneo
                >
                    <Text style={styles.scanButtonText}>
                        <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Cantidad para Agregar</Text>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(processQuantity(quantity - 1))}
                >
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={quantity.toString()}
                    onChangeText={(text) => setQuantity(Number(text))}
                />
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(processQuantity(quantity + 1))}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.row2}>
                <Text style={styles.label3}>Tipo de Inventario</Text>

                <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                    <Text style={styles.dropdownButtonText}>{selectedInventoryType}</Text>
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

            <Text style={styles.label}>Descripción del componente</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                placeholder="Escriba una pequeña descripción del componente a agregar..."
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={!componentName || !barcode || !description || !quantity}
            >
                <Text style={styles.saveButtonText}>Guardar</Text>
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
                            <Text style={styles.modalTitle}>¡COMPONENTE AGREGADO!</Text>
                            <FontAwesome5 name="box-open" size={100} color="#004270" style={styles.modalIcon} />
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false); // Cierra el modal
                                    navigation.navigate('Components'); // Navega a otra pantalla
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
        paddingHorizontal: 16,
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
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#004270',
        padding: 12,
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
