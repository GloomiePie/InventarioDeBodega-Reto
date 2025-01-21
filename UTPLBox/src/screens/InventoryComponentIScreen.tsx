import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, Animated, Image, StyleSheet,
    TouchableOpacity, FlatList, Modal, Dimensions,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const InventoryComponent = () => {
    const [addCount, setAddCount] = useState(0);
    const [removeCount, setRemoveCount] = useState(0);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedInventoryType, setSelectedInventoryType] = useState("Suministros de Oficina");


    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [drawerAnimation] = useState(new Animated.Value(width));
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setDrawerVisible(false);
            setModalVisible(false);
            return () => {
                // Aquí puedes realizar limpieza si es necesario
                setDrawerVisible(false);
                setModalVisible(false);
            };
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            drawerAnimation.setValue(width); // Restablecer la posición inicial del drawer
            return () => {
                drawerAnimation.setValue(width); // Limpieza al salir
            };
        }, [])
    );


    const inventoryTypes = [
        "Suministros de Oficina",
        "Equipos y Mobiliarios",
        "Material Educativo",
        "Material Deportivo",
    ];

    const movements = [
        { id: 1, time: "21:10", tipo: "agregado", amount: 20 },
        { id: 2, time: "13:00", tipo: "agregado", amount: 3 },
        { id: 3, time: "8:45", tipo: "retirado", amount: 2 },
        { id: 4, time: "Ayer", tipo: "agregado", amount: 15 },
        { id: 5, time: "Hace 2 días", tipo: "retirado", amount: 9 },
    ];

    // Define el tipo de parámetros del Drawer Navigator
    type DrawerParamList = {
        Home: undefined;
        History: undefined;
        Components: undefined;
        Barcode: undefined;
    };

    // Tipar el hook de navegación
    type NavigationProps = DrawerNavigationProp<DrawerParamList>;

    const navigation = useNavigation<NavigationProps>();// Usar el hook para acceder a la navegación

    // Example function to fetch data
    const getItemDetails = () => {
        return {
            name: "Marcadores Líquidos",

            imageUrl: require('../assets/example/markers.png'), // Replace with your image URL
            barcode: "LAF231DSA",
            inventoryType: "Suministros de Oficina",
            description:
                "Instrumentos de escritura que contienen tinta a base de agua o alcohol, y su punta, generalmente de fieltro, permite trazos suaves y fluidos en diversas superficies. Son utilizados comúnmente para escribir en pizarras blancas o superficies no porosas.",
            inventoryCount: 50,
        };
    };

    const item = getItemDetails();

    const [description, setDescription] = useState(item.description);


    // Inicializar el estado de la descripción con el valor inicial del item
    useEffect(() => {
        setDescription(item.description);
    }, [item.description]); // Esto asegura que se actualice si `item.description` cambia



    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const selectInventoryType = (type: string) => {
        setSelectedInventoryType(type);
        setDropdownVisible(false);
    };

    const toggleDrawer = () => {
        if (isDrawerVisible) {
            // Cerrar el drawer
            Animated.timing(drawerAnimation, {
                toValue: width, // Mover fuera de la pantalla (derecha)
                duration: 300,
                useNativeDriver: true,
            }).start(() => setDrawerVisible(false));
        } else {
            // Abrir el drawer
            setDrawerVisible(true);
            Animated.timing(drawerAnimation, {
                toValue: 0, // Mover dentro de la pantalla
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleSaveChanges = () => {
        // Mostrar la ventana emergente
        setModalVisible(true);

    };

    const handleModalClose = () => {
        setModalVisible(false);
        setTimeout(() => {
            navigation.navigate('Components');
        }, 300); // Agrega un pequeño retraso para evitar problemas al navegar
    };



    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header2} >
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                    <Text style={styles.title2}>Componente</Text>
                    <TouchableOpacity onPress={toggleDrawer} style={styles.historyButton}>
                        <FontAwesome5 name="history" size={24} color="#004270" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>{item.name}</Text>

                <Image source={item.imageUrl} style={styles.image} />

                <Text style={styles.subtitle}>Cantidad en el Inventario</Text>
                <Text style={styles.inventoryCount}>{item.inventoryCount}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Código de Barras</Text>
                    <View style={styles.barcodeRowWrapper}>
                        <Text style={styles.barcode}>{item.barcode}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Barcode')}>
                            <MaterialCommunityIcons name="barcode-scan" size={35} color="white" style={styles.barcodeIcon} />
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={styles.rowInline}>
                    <View style={styles.counterGroup}>
                        <Text style={styles.label}>¿Desea agregar?</Text>
                        <View style={styles.counterRow}>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => setAddCount(addCount + 1)}
                            >
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.counterValue}
                                keyboardType="numeric"
                                value={addCount.toString()}
                                onChangeText={(text) => setAddCount(Math.max(0, parseInt(text) || 0))}
                            />
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => setAddCount(Math.max(0, addCount - 1))}
                            >
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.counterGroup}>
                        <Text style={styles.label}>¿Desea retirar?</Text>
                        <View style={styles.counterRow}>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => setRemoveCount(removeCount + 1)}
                            >
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.counterValue}
                                keyboardType="numeric"
                                value={removeCount.toString()}
                                onChangeText={(text) => setRemoveCount(Math.max(0, parseInt(text) || 0))}
                            />
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => setRemoveCount(Math.max(0, removeCount - 1))}
                            >
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/*style={styles.picker} */}
                <View style={styles.row}>
                    <Text style={styles.label}>Tipo de Inventario</Text>

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

                <View style={styles.row}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={styles.description}
                        multiline
                        editable={true}
                        value={item.description}
                        onChangeText={setDescription}
                    />
                </View>

                <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
                {/* Modal para notificación */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>¡COMPONENTE ACTUALIZADO!</Text>
                            <MaterialCommunityIcons name="cube-outline" size={64} color="#004270" />
                            <TouchableOpacity onPress={handleModalClose} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Aceptar</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

            </View>
            {/* Drawer que se despliega desde la derecha */}
            {isDrawerVisible && (
                <>
                    {/* Fondo oscuro para cerrar el drawer */}
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={toggleDrawer}
                        activeOpacity={1}
                    />
                    <Animated.View
                        style={[
                            styles.drawerContainer,
                            {
                                transform: [{ translateX: drawerAnimation }],
                            },
                        ]}
                    >
                        <Text style={styles.drawerTitle}>Movimientos</Text>
                        <FlatList
                            data={movements}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.movementItem}>
                                    <MaterialCommunityIcons
                                        name={item.tipo === "agregado" ? "arrow-up" : "arrow-down"}
                                        size={24}
                                        color={item.tipo === "agregado" ? "green" : "red"}
                                    />
                                    <Text style={styles.movementText}>
                                        {item.time} - {item.tipo} {item.amount} unidades
                                    </Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </Animated.View>
                </>
            )}
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    header2: {
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
    title2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: '#003366',
    },
    textCard: {
        backgroundColor: "black",
    },
    barcodeRowWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    barcode: {
        fontSize: 16,
        backgroundColor: "white",
        padding: 8,
        borderRadius: 8,
        color: "black",
        flex: 1,
    },
    barcodeIcon: {
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#004270',
        borderRadius: 30,
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginBottom: 16,
        borderRadius: 20,
    },
    subtitle: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 4,
    },
    inventoryCount: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    row: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    rowInline: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    counterGroup: {
        flex: 1,
        marginHorizontal: 8,
    },
    barcodeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#007bff",
        padding: 8,
        borderRadius: 8,
    },
    counterRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    counterButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#004270",
        borderRadius: 20,
    },
    counterButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    counterValue: {
        fontSize: 18,
        marginHorizontal: 16,
        backgroundColor: "white",
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "white",
    },
    description: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
        backgroundColor: "white",
        textAlignVertical: "top",
        minHeight: 80,
    },
    saveButton: {
        backgroundColor: "#004270",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 18,
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
    historyButton: {
        marginLeft: "auto",
        padding: 8,
        borderRadius: 8,
    },
    drawerContainer: {
        position: "absolute",
        marginHorizontal: -10,
        top: 0,
        right: 0,
        width: "80%",
        height: height + 40, // Asegura que cubra toda la altura de la pantalla
        backgroundColor: "white",
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 2, // Asegura que el drawer esté encima del contenido
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height + 40,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1, // Fondo oscuro debajo del drawer
    },
    drawerTitle: {
        paddingTop: 30,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    movementItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    movementText: {
        marginLeft: 10,
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#004270",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        alignItems: "center",
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#004270",
        marginBottom: 20,
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: "#004270",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default InventoryComponent;
