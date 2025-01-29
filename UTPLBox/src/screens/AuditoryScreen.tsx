import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, FlatList, StyleSheet,
    Animated, Easing, Modal, TextInput, Alert, Dimensions
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

export default function AuditCalendar() {
    const [addAuditModalVisible, setAddAuditModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('DD/MM/YYYY'));
    const [auditsForSelectedDate, setAuditsForSelectedDate] = useState<Audit[]>([]);
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
    const [slideAnim] = useState(new Animated.Value(0));
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const showDatePicker = () => setDatePickerVisible(true);

    const handleDateChange = (_: any, selectedDate?: Date) => {
        setDatePickerVisible(false);

        if (selectedDate) {
            const formattedDate = dayjs(selectedDate).format('DD/MM/YYYY');
            setNewAudit({ ...newAudit, date: formattedDate });
        }
    };



    // Función para manejar la selección de "AM" o "PM"
    const handleTimePeriodChange = (type: 'startPeriod' | 'endPeriod', period: 'AM' | 'PM') => {
        setNewAudit({ ...newAudit, [type]: period });
    };


    const isValidTimeRange = (startTime: string, startPeriod: 'AM' | 'PM', endTime: string, endPeriod: 'AM' | 'PM') => {
        const startHour = parseInt(startTime, 10) + (startPeriod === 'PM' && startTime !== '12' ? 12 : 0);
        const endHour = parseInt(endTime, 10) + (endPeriod === 'PM' && endTime !== '12' ? 12 : 0);

        return startHour < endHour;
    };

    interface NewAudit {
        date: string;
        startTime: string;
        startPeriod: 'AM' | 'PM';
        endTime: string;
        endPeriod: 'AM' | 'PM';
        frequency: string;
    }

    const [newAudit, setNewAudit] = useState<NewAudit>({
        date: dayjs().format('DD/MM/YYYY'), // Fecha inicial válida
        startTime: '',
        startPeriod: 'AM',
        endTime: '',
        endPeriod: 'AM',
        frequency: 'No repite',
    });


    const generateRecurringAudits = (baseAudit: Audit, frequency: string): Audit[] => {
        const recurringAudits: Audit[] = [];
        const baseDate = dayjs(baseAudit.date, 'DD/MM/YYYY'); // Asegurarse de usar el formato DD/MM/YYYY
        const maxIterations = 50; // Límite para evitar ciclos infinitos

        for (let i = 1; i <= maxIterations; i++) {
            let newDate;

            switch (frequency) {
                case 'Diariamente':
                    newDate = baseDate.add(i, 'day');
                    break;
                case 'Semanalmente':
                    newDate = baseDate.add(i, 'week');
                    break;
                case 'Mensualmente':
                    newDate = baseDate.add(i, 'month');
                    break;
                default:
                    return recurringAudits; // Si no hay frecuencia, devuelve solo la base
            }

            if (newDate) {
                const formattedDate = newDate.format('DD/MM/YYYY'); // Formatear la fecha como DD/MM/YYYY
                const newAudit = {
                    ...baseAudit,
                    id: `${baseAudit.id}-${i}`, // Asignar un nuevo ID único
                    date: formattedDate, // Asignar la nueva fecha
                };
                recurringAudits.push(newAudit);
            }
        }

        return recurringAudits;
    };


    // Función para guardar las auditorías en AsyncStorage
    const saveAuditsToStorage = async (audits: Audit[]) => {
        try {
            const jsonValue = JSON.stringify(audits);
            await AsyncStorage.setItem('audits', jsonValue);
        } catch (e) {
            console.error('Error saving audits to storage', e);
        }
    };

    const handleAddAudit = async () => {
        if (!dayjs(newAudit.date, 'DD/MM/YYYY', true).isValid()) {
            Alert.alert('La fecha seleccionada no es válida.');
            return;
        }

        if (!newAudit.startTime || !newAudit.endTime || !newAudit.frequency) {
            Alert.alert('Debes completar todos los campos para agendar una auditoría.');
            return;
        }

        if (!isValidTimeRange(newAudit.startTime, newAudit.startPeriod, newAudit.endTime, newAudit.endPeriod)) {
            Alert.alert('La hora de inicio debe ser anterior a la hora de fin.');
            return;
        }

        const baseAudit: Audit = {
            id: (audits.length + 1).toString(),
            title: 'Auditoría Programada',
            date: newAudit.date,
            startTime: `${newAudit.startTime} ${newAudit.startPeriod}`,
            endTime: `${newAudit.endTime} ${newAudit.endPeriod}`,
        };

        let allAudits = [baseAudit];
        if (newAudit.frequency !== 'No repite') {
            const recurringAudits = generateRecurringAudits(baseAudit, newAudit.frequency);
            allAudits = [...allAudits, ...recurringAudits];
        }

        const updatedAudits = [...audits, ...allAudits];

        console.log('Auditorías antes de guardar:', updatedAudits);
        setAudits(updatedAudits);
        await saveAuditsToStorage(updatedAudits);



        setAuditsForSelectedDate(getAuditsByDate(newAudit.date));
        initializeMarkedDates();
        closeAddAuditModal();



        setTimeout(() => {
            setSelectedAudit(baseAudit);
            setTimeout(() => {
                setModalVisible(true);
            }, 300);
        }, 300);
    };


    const [audits, setAudits] = useState<Audit[]>([
        
    ]);

    const initializeMarkedDates = () => {
        const datesWithAudits: { [key: string]: any } = {};
        audits.forEach(audit => {
            const auditDate = dayjs(audit.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            datesWithAudits[auditDate] = { marked: true, dotColor: '#f2b705' };
        });
        setMarkedDates({
            ...datesWithAudits,
            [dayjs(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')]: {
                selected: true,
                selectedColor: '#004270',
            },
        });
    };


    const handleDayPress = (day: { dateString: string }) => {
        const formattedDate = dayjs(day.dateString, 'YYYY-MM-DD').format('DD/MM/YYYY');
        setSelectedDate(formattedDate);
        const filteredAudits = getAuditsByDate(formattedDate);
        setAuditsForSelectedDate(filteredAudits);
        setMarkedDates({
            ...markedDates,
            [day.dateString]: {
                ...markedDates[day.dateString],
                selected: true,
                selectedColor: '#004270',
            },
        });
    };

    interface Audit {
        id: string;
        title: string;
        date: string;
        startTime: string;
        endTime: string;
    }

    const openModal = (audit: Audit) => {
        setSelectedAudit(audit);
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    const getAuditsByDate = (date: string) => {
        return audits.filter(audit => audit.date === date);
    };

    useEffect(() => {
        initializeMarkedDates();
    }, [selectedDate]);

    // Define el tipo de parámetros del Drawer Navigator
    type DrawerParamList = {
        Home: undefined;
        History: undefined;
        Components: undefined;
    };

    // Tipar el hook de navegación
    type NavigationProps = DrawerNavigationProp<DrawerParamList>;

    const navigation = useNavigation<NavigationProps>();// Usar el hook para acceder a la navegación

    const openAddAuditModal = () => {
        setAddAuditModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const closeAddAuditModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => setAddAuditModalVisible(false));
    };


    return (
        <View style={styles.container}>
            <View style={styles.header2}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Auditorías Programadas</Text>
                <TouchableOpacity style={styles.addButton} onPress={openAddAuditModal}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>


            </View>
            <Calendar
                current={dayjs(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                style={styles.calendar}
                theme={{
                    arrowColor: 'black',
                    dotColor: '#f2b705',
                    selectedDayBackgroundColor: '#004270',
                }}
            />
            <FlatList
                data={auditsForSelectedDate}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.eventCard}
                        onPress={() => openModal(item)}
                    >

                        <View style={styles.iconContainer}>
                            <Feather name="alert-circle" size={40} color="#f2b705" />
                        </View>
                        <View style={styles.auditCard}>
                            <Text style={styles.auditTitle}>{item.title}</Text>
                            <Text style={styles.auditDate}>{item.date}</Text>
                            <Text style={styles.auditTime}>{item.startTime} a {item.endTime}</Text>
                        </View>

                    </TouchableOpacity>
                )}
            />
            <Modal transparent={true} visible={addAuditModalVisible} animationType="fade">
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAddAuditModal}>

                </TouchableOpacity>
                <Animated.View
                    style={[
                        styles.modalContent,

                    ]}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalTitle}>Agendar Auditoría</Text>
                        <View style={styles.datePickerContainer}>
                            <Text style={styles.modalText}>Fecha:</Text>
                            <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                                <Text style={styles.dateButtonText}>
                                    {newAudit.date || 'Seleccionar fecha'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {isDatePickerVisible && (
                            <DateTimePicker
                                value={newAudit.date ? dayjs(newAudit.date, 'DD/MM/YYYY').toDate() : new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        {/* Selección de hora de inicio */}
                        <View style={styles.timePickerContainer}>
                            <Text style={styles.modalText}>Hora de inicio:</Text>
                            <View style={styles.timeInputContainer}>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="Hora"
                                    value={newAudit.startTime}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    onChangeText={(text) =>
                                        setNewAudit({ ...newAudit, startTime: text })
                                    }
                                />
                                <View style={styles.timePeriodContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.timePeriodButton,
                                            newAudit.startPeriod === 'AM' && styles.selectedTimePeriod,
                                        ]}
                                        onPress={() => handleTimePeriodChange('startPeriod', 'AM')}
                                    >
                                        <Text style={styles.timePeriodText}>AM</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.timePeriodButton,
                                            newAudit.startPeriod === 'PM' && styles.selectedTimePeriod,
                                        ]}
                                        onPress={() => handleTimePeriodChange('startPeriod', 'PM')}
                                    >
                                        <Text style={styles.timePeriodText}>PM</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* Selección de hora de fin */}
                        <View style={styles.timePickerContainer}>
                            <Text style={styles.modalText}>Hora de fin:</Text>
                            <View style={styles.timeInputContainer}>
                                <TextInput
                                    style={styles.timeInput}
                                    placeholder="Hora"
                                    value={newAudit.endTime}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    onChangeText={(text) =>
                                        setNewAudit({ ...newAudit, endTime: text })
                                    }
                                />
                                <View style={styles.timePeriodContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.timePeriodButton,
                                            newAudit.endPeriod === 'AM' && styles.selectedTimePeriod,
                                        ]}
                                        onPress={() => handleTimePeriodChange('endPeriod', 'AM')}
                                    >
                                        <Text style={styles.timePeriodText}>AM</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.timePeriodButton,
                                            newAudit.endPeriod === 'PM' && styles.selectedTimePeriod,
                                        ]}
                                        onPress={() => handleTimePeriodChange('endPeriod', 'PM')}
                                    >
                                        <Text style={styles.timePeriodText}>PM</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* Selección de frecuencia */}
                        <View>
                            <Text style={styles.modalText}>Frecuencia:</Text>
                            <Picker
                                selectedValue={newAudit.frequency}
                                style={styles.picker}
                                onValueChange={(itemValue) => setNewAudit({ ...newAudit, frequency: itemValue })}
                            >
                                <Picker.Item label="No repite" value="No repite" />
                                <Picker.Item label="Diariamente" value="Diariamente" />
                                <Picker.Item label="Semanalmente" value="Semanalmente" />
                                <Picker.Item label="Mensualmente" value="Mensualmente" />
                            </Picker>


                        </View>
                        <TouchableOpacity style={styles.addButton2} onPress={handleAddAudit}>
                            <Text style={styles.addButtonText2}>Aceptar</Text>
                        </TouchableOpacity>

                    </View>

                </Animated.View>
            </Modal>
            {/* Ventana emergente */}
            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeModal}>
                    <View style={styles.modalBody2}>
                        <Text style={styles.modalTitle2}>¡AUDITORIA PROGRAMADA!</Text>
                        <Feather name="alert-circle" size={50} color="#004270" style={styles.modalIcon} />
                        {selectedAudit && (
                            <>
                                <Text style={styles.modalText}>
                                    Fecha Programada: {dayjs(selectedAudit.date, 'DD/MM/YYYY').isValid()
                                        ? selectedAudit.date
                                        : 'Fecha inválida'}
                                </Text>
                                <Text style={styles.modalText}>
                                    Hora Programada: {selectedAudit.startTime} - {selectedAudit.endTime}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    menuIcon: {
        color: '#004B87',
        fontSize: 24,
        paddingRight: 50,
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
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
        color: '#333',
        marginRight: 20,
    },
    calendar: {
        margin: 30,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    auditCard: {
        fontSize: 10,
        marginLeft: 12,
    },
    auditTitle: {
        fontWeight: 'bold',
        color: '#004B87',
        alignItems: 'stretch',
    },
    icon: {
        marginRight: 16,
    },
    auditDate: {
        color: '#757575',
    },
    auditTime: {
        color: '#757575',
    },
    addButton2: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#004270',
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    addButton: {
        borderRadius: 25,
        textAlignVertical: 'center',
        marginLeft: 10,
        marginBottom: 7,
    },
    addButtonText2: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButtonText: {
        color: '#004270',
        fontSize: 30,
    },
    overlay2: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: height,
        zIndex: 1,

    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: height,
        zIndex: 1,
        justifyContent: 'flex-end'
    },
    modalContent2: {
        backgroundColor: 'white', padding: 20, borderRadius: 10
    },
    modalContent: {
        backgroundColor: '#fff', // Asegúrate de que no sea transparente
        padding: 15,
        borderRadius: 10,
    },
    modalBody2: {
        alignItems: 'center',
        justifyContent: 'center', // Centrar contenido
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff', // Fondo blanco para el modal
        borderRadius: 20,
    },

    modalBody: {
        flexDirection: 'column',
        zIndex: 2,
    },
    modalTitle2: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#004270',
    },
    modalIcon: {
        padding: 20
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#004270',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    closeButton: {
        backgroundColor: '#004270',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 8,
        padding: 20,
        borderRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        backgroundColor: '#f9f9f9',
    },
    picker: {
        width: '60%',
        height: 50,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    timePickerContainer: {
        marginBottom: 10,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginRight: "50%",
        width: 60,
        textAlign: 'center',
    },
    timePeriodPicker: {
        width: 100,
    },
    timePeriodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    timePeriodButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5
    },

    selectedTimePeriod: {
        backgroundColor: '#004270',
        borderColor: '#004270',
        color: 'white'
    },
    timePeriodText: {
        fontSize: 16,
    },
    selectedTimePeriodText: {
        color: 'white',
    },
    saveButton: { color: 'green', textAlign: 'center', marginTop: 20 },
});
