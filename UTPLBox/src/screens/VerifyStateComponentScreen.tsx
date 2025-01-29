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
    Modal,
    Dimensions
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

const { width, height } = Dimensions.get("window");

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
    Components: undefined;
    Barcode: undefined;
    StateScanner: undefined;
};

export type Componente = {
    id: string;
    nombre: string;
    cantidad: number;
    limite: number;
    estado: 'Perfecto Estado' | 'Buen Estado (Usado)' | 'Defectuoso' | 'Obsoleto';
    codigo?: string;
    fecha: string;
    hora: string;
    descripcion: string;
    image: string;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export function AddComponentScreen() {
    const navigation = useNavigation<NavigationProps>();

    // Estados para los datos del formulario
    const { barcode, setBarcode, agregarComponenteVerificado } = useBarcode();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedInventoryType, setSelectedInventoryType] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedImages, setSelectedImages] = useState<string[]>([]); // Almacena hasta 3 imágenes
    const [selectedImage] = useState<string | null>(null);

    const [imageModalVisible, setImageModalVisible] = useState(false); // Estado para el modal de agregar imágenes
    const [verifyModalVisible, setVerifyModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            // Restablece otros estados pero NO reinicia el código de barras
            setSelectedInventoryType(null); // Inicializa como null
            setDescription('');
            setSelectedImages([]);
            closeImageModal()

            // Opcional: Lógica para actualizar la interfaz
            return () => {
                // Limpieza si es necesario
            };
        }, [])
    );

    // Función para cerrar el modal de verificación
    const closeVerifyModal = () => {
        setVerifyModalVisible(false);
        navigation.navigate('Home'); // Redirige al usuario después de cerrar el modal
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

    const handleSave = () => {
        if (!barcode.trim() || !selectedInventoryType || selectedInventoryType === "Selecciona el estado del producto") {
            Alert.alert('Error', 'Seleccione el estado del componente.');
            return;
        }

        const componente: Componente = {
            id: Math.random().toString(),
            nombre: barcode,
            cantidad: 15, // Puedes ajustar esto según sea necesario
            limite: 10, // Puedes ajustar esto según sea necesario
            estado: selectedInventoryType as 'Perfecto Estado' | 'Buen Estado (Usado)' | 'Defectuoso' | 'Obsoleto',
            codigo: barcode,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString(),
            descripcion: description,
            image: JSON.stringify(selectedImages),
        };

        agregarComponenteVerificado(componente);
        setModalVisible(true);
        console.log('Datos procesados:', componente);
    };


    const pickImageFromGallery = async () => {
        setModalVisible(false); // Cerrar el modal
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

        if (!result.canceled && result.assets[0].uri) {
            if (selectedImages.length < 3) {
                setSelectedImages([...selectedImages, result.assets[0].uri]);
            }
            console.log('Datos procesados:', result.assets[0].uri);
        }

    };

    const takePhoto = async () => {
        setModalVisible(false); // Cerrar el modal
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se requiere permiso para usar la cámara');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            if (selectedImages.length < 3) {
                setSelectedImages([...selectedImages, result.assets[0].uri]);
            }
        }
    };

    // Función para abrir el modal de agregar imágenes
    const showImageOptions = () => {
        console.log("Abriendo modal de imágenes");
        setImageModalVisible(true);
    };

    // Función para cerrar el modal de agregar imágenes
    const closeImageModal = () => {
        setImageModalVisible(false);
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

            {/* Campo de Código de Barras */}
            <Text style={styles.label}>Buscar el componente</Text>
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
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
                placeholder="Escriba el defecto encontrado..."
            />
            <View style={styles.container2}>
                <Text style={styles.label}>AGREGAR EVIDENCIA EN CASO DE ENCONTRAR ALGÚN DESPERFECTO</Text>
                {selectedImages.length < 3 && (
                    <TouchableOpacity style={styles.imagePlaceholder} onPress={showImageOptions}>
                        <MaterialCommunityIcons name="image-plus" size={100} color="#004270" />
                    </TouchableOpacity>
                )}
                <View style={styles.imagesContainer}>
                    {selectedImages.map((uri, index) => (
                        <Image
                            key={index}
                            source={{ uri }}
                            style={styles.imagePreview}
                        />
                    ))}
                </View>
                {imageModalVisible && (
                    <Modal
                        transparent={true}
                        visible={imageModalVisible}
                        animationType="fade"
                        onRequestClose={closeImageModal}
                    >
                        <View style={styles.modalOverlay2}>
                            <TouchableOpacity
                                style={styles.modalBackground}
                                onPress={closeImageModal} />
                            <View style={styles.modalContent2}>
                                <Text style={styles.modalTitle2}>Agregar imagen</Text>
                                <TouchableOpacity style={styles.modalButton2} onPress={takePhoto}>
                                    <Text style={styles.modalButtonText2}>Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton2} onPress={pickImageFromGallery}>
                                    <Text style={styles.modalButtonText2}>Galería</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
            {modalVisible && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={closeVerifyModal}
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
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#004270',
    },
    label2: {
        padding: 20,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#004270',
        textAlign: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#004270',
    },
    imagePlaceholder2: {
        height: 150,
        width: 150,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: "28%",
        marginBottom: 16,
    },
    imagePlaceholder: {
        alignSelf: 'center',
        marginVertical: 20,
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
    imagePreview: {
        height: 80,
        width: 80,
        margin: 5,
        borderRadius: 8,
    },
    imagesContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centra las imágenes seleccionadas
        flexWrap: 'wrap',
        marginTop: 10,
    },
    modalOverlay2: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    modalContent2: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#004270',
    },
    modalButton2: {
        backgroundColor: '#004270',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalButtonText2: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        width: width,
        height: height
    },
});

export default AddComponentScreen;
