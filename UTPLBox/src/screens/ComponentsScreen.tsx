import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity,
    Image, Animated, Easing, Dimensions
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

// Define el tipo de parámetros del Drawer Navigator
type DrawerParamList = {
    Home: undefined;
    History: undefined;
    InvComponent: { itemId: string }; // Se espera un parámetro itemId
    Barcode: undefined;
};

// Tipar el hook de navegación
type NavigationProps = DrawerNavigationProp<DrawerParamList>;


export interface ItemData {
    id: string;
    name: string;
    quantity: number;
    category: string;
    icon: string;
    image: string;
    description: string;
    barcode: string
}


export default function App() {
    const navigation = useNavigation<NavigationProps>();// Usar el hook para acceder a la navegación
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['Todos']);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const [data, setData] = useState<ItemData[]>([])
    const [search, setSearch] = useState<string>('');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const animatedHeights = useRef<{ [key: string]: Animated.Value }>({}).current;

    useFocusEffect(
        React.useCallback(() => {
            const loadComponents = async () => {
                try {
                    const storedData = await AsyncStorage.getItem('components');
                    const components = storedData ? JSON.parse(storedData) : [];
    
                    // Mapea las propiedades al formato esperado
                    const mappedComponents = components.map((item: any) => ({
                        id: item.id,
                        name: item.name, // Mapea componentName a name
                        description: item.description, // Asegura que se pase correctamente
                        quantity: item.quantity,
                        category: item.category, // Mapea inventoryType a category
                        image: item.image, // Conserva la propiedad image
                        barcode: item.barcode,
                    }));
    
                    setData(mappedComponents);
                } catch (error) {
                    console.error('Error al cargar los datos:', error);
                }
            };
    
            loadComponents();
             return () => {
                // Cuando la pantalla pierde el foco
                setModalVisible(false);
            };
        }, [])
    );

    const handleCategorySelection = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    // Filtrar datos basados en múltiples categorías seleccionadas
    const filteredData = data.filter(item => {

        const name = item.name || ''; 
        const searchText = search || ''; 

        const categories = Array.isArray(item.category) ? item.category : [item.category];

        // Verificamos si se debe incluir el elemento basado en los filtros seleccionados
        const matchesCategory =
            selectedCategories.length === 0 || // Si no hay categorías seleccionadas, incluimos todo
            selectedCategories.includes("Todos") || // Si "Todos" está seleccionado, incluimos todo
            selectedCategories.some(category => categories.includes(category));

        // Verificamos si el nombre coincide con la búsqueda
        const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase());

        // El elemento debe coincidir con ambas condiciones
        return matchesCategory && matchesSearch;
    });


    // Mostrar las categorías seleccionadas en el buscador
    const selectedCategoriesLabel = selectedCategories.length > 0
        ? selectedCategories.join(', ')
        : 'Todos';

    // Modificar la animación para que el modal aparezca en la parte superior
    const filterModalPosition = useRef(new Animated.Value(-500)).current;

    // Inicializar las animaciones para cada elemento
    useEffect(() => {
        data.forEach(item => {
            if (!animatedHeights[item.id]) {
                animatedHeights[item.id] = new Animated.Value(0);
            }
        });
    }, [data]);

    const handleExpand = (id: string) => {
        const isExpanded = expandedItems.includes(id);
        if (isExpanded) {
            // Contraer la sección con animación
            Animated.timing(animatedHeights[id], {
                toValue: 0,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }).start(() => {
                setExpandedItems(expandedItems.filter(item => item !== id));
            });
        } else {
            // Expandir la sección con animación
            setExpandedItems([...expandedItems, id]);
            Animated.timing(animatedHeights[id], {
                toValue: 100, // Altura deseada (ajústala según el contenido)
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }).start();
        }
    };

    // Mapa de las imágenes
    const imageMap: { [key: string]: any } = {
        markers: require('../assets/example/markers.png'),
        extinguisher: require('../assets/example/extinguisher.png'),
        tablet: require('../assets/example/tablet.png'),

    }; // usar carga remota de imagenes para la insercion

    // Animación para el fondo oscuro
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const modalPosition = useRef(new Animated.Value(300)).current;

    const handleOpenModal = () => {
        setModalVisible(true);
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 1, // Oscurecer el fondo
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }),
            Animated.timing(modalPosition, {
                toValue: 0, // Mover la notificación a su posición visible
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handleOpenFilterModal = () => {
        setFilterModalVisible(true);
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 1, // Oscurecer el fondo
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }),
            Animated.timing(filterModalPosition, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            })
        ]).start();
    };

    const handleCloseModal = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0, // Aclarar el fondo
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }),
            Animated.timing(modalPosition, {
                toValue: 300, // Mover la notificación fuera de la pantalla
                duration: 300,
                easing: Easing.in(Easing.quad),
                useNativeDriver: false,
            }),
        ]).start(() => {
            setModalVisible(false); // Cerrar el modal después de la animación
        });
    };

    const handleCloseFilterModal = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0, // Aclarar el fondo
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: false,
            }),
            Animated.timing(filterModalPosition, {
                toValue: -500,
                duration: 300,
                easing: Easing.in(Easing.quad),
                useNativeDriver: false,
            })
        ]).start(() => {
            setFilterModalVisible(false);
        });
    };

    // Renderizar cada elemento de la lista
    const renderItem = ({ item }: { item: ItemData }) => {

        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={ async () => {
                try {
                    // Guarda el componente seleccionado en AsyncStorage
                    await AsyncStorage.setItem('selectedComponent', JSON.stringify(item));
                    // Navega a la pantalla InventoryComponent
                    navigation.navigate('InvComponent', { itemId: item.id });
                } catch (error) {
                    console.error('Error al guardar el componente seleccionado:', error);
                }
            }}
            >
                    <View style={styles.cardContent}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleExpand(item.id)} style={styles.infoButton}>
                            <Text style={styles.infoButtonText}>i</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                {/* Pestaña expandible */}
                {expandedItems.includes(item.id) && (
                    <View style={styles.expandedContent}>
                        <Text style={styles.description}>
                        {item.description}
                        </Text>
                    </View>
                )}

            </View>
        );
    };
    const [modalVisible, setModalVisible] = useState(false);




    return (

        <View style={styles.container}>
            <View style={styles.header2} >
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.header}>

                <TouchableOpacity style={styles.barcodeIcon} onPress={handleOpenModal}>
                    <MaterialCommunityIcons name="barcode-scan" size={26} color="white" />
                </TouchableOpacity>
                {/* Modal */}

                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar..."
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity onPress={handleOpenFilterModal}>
                    <MaterialCommunityIcons name="filter" size={24} color="#004270" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />

            {/* Modal de filtros */}
            {filterModalVisible && (
                <View style={StyleSheet.absoluteFill}>
                    {/* Fondo oscuro */}
                    <Animated.View
                        style={[
                            styles.modalOverlay,
                            {
                                opacity: overlayOpacity,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        ]}
                    >
                        <TouchableOpacity style={styles.overlayTouchable} onPress={handleCloseFilterModal} />
                    </Animated.View>

                    {/* Modal de categorías */}
                    <Animated.View
                        style={[
                            styles.filterModal,
                            { transform: [{ translateY: filterModalPosition }] },
                        ]}
                    >
                        <Text style={styles.modalTitle2}>TIPO DE INVENTARIO</Text>
                        <View style={styles.filterButtons}>
                            {['Todos', 'Suministros de Oficina', 'Equipos y Mobiliarios', 'Tecnología', 
                            'Material Deportivo', 'Limpieza y Seguridad', 
                            'Libros y material Bibliográfico', 'Material Educativo'].map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.filterButton,
                                        selectedCategories.includes(category) && styles.filterButtonSelected,
                                    ]}
                                    onPress={() => handleCategorySelection(category)}
                                >
                                    <Text
                                        style={[
                                            styles.filterButtonText,
                                            selectedCategories.includes(category) && styles.filterButtonTextSelected,
                                        ]}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                </View>
            )}
            <TouchableOpacity style={styles.fab} onPress={handleOpenModal}>
                <MaterialCommunityIcons name="plus" size={24} color="#febe10" />
            </TouchableOpacity>

            {/* Modal */}
            {modalVisible && (
                <View style={StyleSheet.absoluteFill}>
                    {/* Fondo oscuro animado */}
                    <Animated.View
                        style={[
                            styles.modalOverlay,
                            {
                                opacity: overlayOpacity,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        ]}
                    >
                        <TouchableOpacity style={styles.overlayTouchable} onPress={handleCloseModal} />
                    </Animated.View>

                    {/* Notificación */}
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ translateY: modalPosition }],
                            },
                        ]}
                    >
                        <Text style={styles.modalTitle}>
                            ¡POR FAVOR ESCANEA EL CÓDIGO DE BARRAS!
                        </Text>
                        <MaterialCommunityIcons
                            name="barcode-scan"
                            size={80}
                            color="#004270"
                            style={styles.barcodeIcon2}
                        />
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => navigation.navigate('Barcode')}>
                            <Text style={styles.acceptButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
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
    image: {
        width: 100,
        height: 80,
        borderRadius: 20,
    },
    menuIcon: {
        color: '#004B87',
        fontSize: 24,
        paddingRight: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f4f4f8',
    },
    barcodeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#004270',
        borderRadius: 30,
    },
    barcodeIcon2: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    modalOverlay: {
        flex: 1,
        height: height,
        justifyContent: "flex-end", // Posiciona el modal en la parte inferior
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
        zIndex: 1,
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        zIndex: 2,
    },
    modalTitle2: {
        paddingTop: 50,
        fontSize: 18,
        fontWeight: "bold",
        color: "#004270",
        marginBottom: 10,
        justifyContent: "flex-start",
        textAlign: "left",
    },
    modalTitle: {
        paddingTop: 20,
        fontSize: 18,
        fontWeight: "bold",
        color: "#004270",
        marginBottom: 10,
        textAlign: "center",
    },
    acceptButton: {
        backgroundColor: '#004270',
        padding: 10,
        marginBottom: 50,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    searchBar: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: "white",
        borderRadius: 20,
    },
    list: {
        padding: 10,
    },
    infoButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center',
        backgroundColor: '#febe10',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    infoButtonText: {
        fontSize: 18,
        color: '#004270',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        marginRight: 15,
    },
    expandedContent: {
        width: '100%', // Asegurar que ocupe todo el ancho del contenedor
        marginTop: 10, // Separación del contenido principal
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    textContainer: {
        flex: 1,             // Ocupa todo el espacio restante
        marginLeft: 10,      // Separación respecto a la imagen
    },

    itemCard: {
        textAlign: 'left',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 14,
        color: 'gray',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#004270',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayTouchable: {
        flex: 1
    },

    filterModal: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        zIndex: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        fontSize: 80,
    },
    filterButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontSize: 30,
    },
    filterButton: {
        padding: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        margin: 5,
        backgroundColor: "#f1e1a5",
        fontWeight: "bold",
    },
    filterButtonSelected: {
        backgroundColor: '#febe10',
        borderColor: '#febe10'
    },
    filterButtonText: {
        fontSize: 14,
    },
    filterButtonTextSelected: {
        color: 'black'
    },
});
