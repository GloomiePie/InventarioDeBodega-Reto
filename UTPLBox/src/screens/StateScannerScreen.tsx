import React from 'react';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useCallback, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { useBarcode } from './BarcodeContext/BarcodeContext';

import { AppState } from 'react-native';

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
    InvComponent: undefined;
    Barcode: undefined;
    AddComp: undefined;
    VerifyState: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;

export function StateScannerScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [cameraActive, setCameraActive] = useState(false); // Control de cámara
    const [modalVisible, setModalVisible] = useState(false);
    const storedBarcodes = ['X000MK5QAX'];
    const [modalType, setModalType] = useState<'found' | 'not-found'>('found');


    const { setBarcode } = useBarcode();

    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active') {
                setModalVisible(false); // Cierra el modal al volver a la app
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, []);

    // Solicitar permiso para usar la cámara
    const requestCameraPermission = async () => {
        if (!permission?.granted) {
            await requestPermission();
        }
    };

    // Manejar el enfoque de la pantalla
    useFocusEffect(
        useCallback(() => {
            setScanned(false);
            setModalVisible(false);
            setCameraActive(false);
            requestCameraPermission();
        }, [permission])
    );

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (!scanned) {
            setScanned(true);
            setBarcode(data); // Almacenar el código escaneado

            if (storedBarcodes.includes(data)) {
                // Código encontrado
                setModalType('found');
                setModalVisible(true);
            } else {
                // Código no encontrado
                setModalType('not-found');
                setModalVisible(true);
            }
        }
    };

    const handleScanClick = () => {
        setCameraActive(true);
        setScanned(false);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCameraActive(false);
    };

    if (!permission?.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.message}>Necesitamos tu permiso para usar la cámara</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
                    <Text style={styles.permissionButtonText}>Otorgar Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Renderizar la cámara si está activa */}
            {cameraActive && (
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    barcodeScannerSettings={{
                        barcodeTypes: ['code128', 'ean13', 'ean8'],
                    }}
                    onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                >
                    <View style={styles.overlay}>
                        <View style={styles.topOverlay}></View>
                        <View style={styles.middleOverlay}>
                            <View style={styles.sideOverlay}></View>
                            <View style={styles.scanBox}>
                                <MaterialCommunityIcons name="barcode-scan" size={261}
                                    color="white" style={styles.scanIcon} />
                            </View>
                            <View style={styles.sideOverlay}></View>
                        </View>
                        <View style={styles.bottomOverlay}></View>
                    </View>
                </CameraView>
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {modalType === 'found' ? (
                            <>
                                <Text style={styles.modalTitle}>COMPONENTE ENCONTRADO</Text>
                                <FontAwesome5 name="box-open" size={48} color="#004270" style={styles.icon} />
                                <TouchableOpacity
                                    style={styles.buttonBlue2}
                                    onPress={() => navigation.navigate('VerifyState')}
                                >
                                    <Text style={styles.buttonText2}>Aceptar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.modalTitle}>COMPONENTE NO ENCONTRADO</Text>
                                <Text style={styles.modalSubtitle}>¿DESEA AGREGARLO?</Text>
                                <FontAwesome5 name="box-open" size={48} color="#004270" style={styles.icon} />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.buttonYellow}
                                        onPress={() => {
                                            closeModal();
                                            navigation.navigate('Home');
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Volver al Inicio</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.buttonBlue}
                                        onPress={() => {
                                            closeModal();
                                            navigation.navigate('AddComp');
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Agregar Componente</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.iconButton} onPress={handleScanClick}>
                    <MaterialIcons name="qr-code-scanner" size={24} color="white" />
                    <Text style={styles.buttonText}>Escanear</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#202020',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202020',
    },
    icon: {
        margin: 20,
    },
    message: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    permissionButton: {
        backgroundColor: '#505050',
        padding: 10,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    middleOverlay: {
        flexDirection: 'row',
        width: '100%',
        height: 200,
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    scanBox: {
        width: 260, // Ajustado para ser ligeramente más grande
        height: '100%', // Ajustado para ser ligeramente más grande
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    scanIcon: {
        position: 'absolute',
        borderRadius: 20,
        zIndex: 1,
    },
    bottomOverlay: {
        flex: 1,
        height: '20%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    buttonBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#303030',
        alignItems: 'center',
    },
    iconButton: {
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        color: '#004270',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalSubtitle: {
        color: '#004270',
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
    modalIcon: {
        marginVertical: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonYellow: {
        backgroundColor: '#f2b705',
        padding: 5,
        borderRadius: 8,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonBlue: {
        backgroundColor: '#004270',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
        textAlign: 'center'
    },
    buttonBlue2: {
        backgroundColor: '#004270',
        paddingVertical: 14, // Aumentado para un área de toque más cómoda
        paddingHorizontal: 24,
        borderRadius: 10, // Bordes redondeados para consistencia visual
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center', // Centrado del texto
    },
    buttonText2: {
        color: '#FFFFFF', // Contraste para asegurar que sea legible
        fontSize: 18, // Texto más grande para mejor visibilidad
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
});
