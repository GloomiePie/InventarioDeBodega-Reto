import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import dayjs from 'dayjs';
import { Svg, G, Text as SvgText, Path } from 'react-native-svg';
import { BarChart } from 'react-native-chart-kit';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const { width: screenWidth } = Dimensions.get('window');

// Genera tonos de azul más oscuros en función del índice y la cantidad total de segmentos
const generateBlueShade = (index: number, total: number) => {
  const baseHue = 50; // Amarillo base
  const saturation = 100; // Saturación completa
  const lightness = 35 + (index / total) * 40; // Variación de luminosidad
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

// Estructura de eventos
type Evento = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
};

const CustomCalendar: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [componentModalVisible, setComponentModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [selectedComponente, setSelectedComponente] = useState<Componente | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [audits, setAudits] = useState<Evento[]>([]);

  // Función para simular la detección de notificaciones
  const checkNotifications = () => {

    // Aquí puedes implementar la lógica real para verificar notificaciones
    // Por ahora simulamos con un valor booleano fijo o aleatorio
    const notificationsExist = Math.random() > 0.5; // Simulación (reemplazar con lógica real)
    setHasNotifications(notificationsExist);
  };

  // Cargar las auditorías al montar el componente
useEffect(() => {
  checkNotifications();
  const loadAudits = async () => {
    const storedAudits = await AsyncStorage.getItem('audits');
    const parsedAudits = storedAudits ? JSON.parse(storedAudits) : [];
    setAudits(parsedAudits);
  };
  loadAudits();
}, []);

// Usar useFocusEffect para recargar las auditorías cuando la pantalla se enfoque
useFocusEffect(
  React.useCallback(() => {
    const loadAudits = async () => {
      try {
        const storedAudits = await AsyncStorage.getItem('audits');
        const parsedAudits = storedAudits ? JSON.parse(storedAudits) : [];
        setAudits(parsedAudits);
      } catch (e) {
        console.error('Error al cargar auditorías desde AsyncStorage', e);
      }
    };
    loadAudits();
  }, [])
);

  // Convertir las auditorías al formato de Evento
  const eventos: Evento[] = audits.map(audit => ({
    date: audit.date,   // Mapear 'date' a 'fecha'
    endTime: audit.endTime,      // Mapear 'endTime' a 'horaFin'
    id: audit.id,
    startTime: audit.startTime, // Mapear 'startTime' a 'horaInicio'
    title: audit.title, // Mapear 'title' a 'titulo'
  }));

  type Componente = {
    id: string;
    titulo: string;
    hora: string;
    nombre: string;
    codigoBarras: string;
    horaIncidencia: string;
    fechaIncidencia: string;
    limite: number;
    cantidad: number;
  };

  // Filtrar los próximos eventos
  const proximosEventos = eventos
    .filter((evento) => {
      const parsedDate = dayjs(evento.date, 'DD/MM/YYYY');
      return parsedDate.isValid() && parsedDate.isAfter(dayjs()); // Solo eventos futuros
    })
    .sort((a, b) =>
      dayjs(a.date, 'DD/MM/YYYY').diff(dayjs(b.date, 'DD/MM/YYYY')) // Ordenar por fecha
    )
    .slice(0, 2); // Mostrar los 2 eventos más cercanos

  const componentesBajos: Componente[] = [
    {
      id: '1',
      titulo: 'Componente por debajo del Límite',
      hora: '07:30 am',
      nombre: 'Componente A',
      codigoBarras: '1234567890',
      horaIncidencia: '07:30 am',
      fechaIncidencia: '2025-01-22',
      limite: 50,
      cantidad: 30,
    },
    {
      id: '2',
      titulo: 'Componente por debajo del Límite',
      hora: '07:15 am',
      nombre: 'Componente B',
      codigoBarras: '0987654321',
      horaIncidencia: '07:15 am',
      fechaIncidencia: '2025-01-25',
      limite: 20,
      cantidad: 15,
    },
    {
      id: '3',
      titulo: 'Componente por debajo del Límite',
      hora: '08:00 am',
      nombre: 'Componente C',
      codigoBarras: '1122334455',
      horaIncidencia: '08:00 am',
      fechaIncidencia: '2025-01-23',
      limite: 10,
      cantidad: 11,
    },
  ];

  const handleEventPress = (event: Evento) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };


  // Datos quemados para "Componentes por Tipo"
  const componentesPorTipo = [
    { tipo: 'CPU', cantidad: 16, color: '#FF6384' },
    { tipo: 'Monitor', cantidad: 9, color: '#36A2EB' },
    { tipo: 'Teclado', cantidad: 25, color: '#FFCE56' },
    { tipo: 'Mouse', cantidad: 20, color: '#4BC0C0' },
    { tipo: 'Audifonos', cantidad: 30, color: '#2f2f2f' },
  ];

  const totalCantidad = componentesPorTipo.reduce((sum, item) => sum + item.cantidad, 0);
  const radius = 250;

  let startAngle = 0;

  // Datos quemados para "Últimos Movimientos"
  const ultimosMovimientos = [
    {
      id: '1',
      descripcion: 'Se agregó 20 unidades a marcadores líquidos modificado por Pablo Reyes',
      fecha: '2024-12-27',
      tipo: 'agregado',
    },
    {
      id: '2',
      descripcion: 'Se retiró 2 unidades a mesa circular modificado por Pedro Gonzales',
      fecha: '2024-09-04',
      tipo: 'retirado',
    },
    {
      id: '3',
      descripcion: 'Se agregó 3 unidades a extintores modificado por Leonardo Chuquimarca',
      fecha: '2024-12-04',
      tipo: 'agregado',
    },
  ];

  // Generar días de la semana actual
  const getWeekDays = (date: dayjs.Dayjs) => {
    const startOfWeek = date.startOf('week'); // Primer día de la semana (domingo)
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }

    return days;
  };

  const currentWeek = getWeekDays(currentDate);

  // Navegar a la semana anterior
  const goToPreviousWeek = () => setCurrentDate(currentDate.subtract(1, 'week'));

  // Navegar a la semana siguiente
  const goToNextWeek = () => setCurrentDate(currentDate.add(1, 'week'));

  const data = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],  // Etiquetas del gráfico
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],  // Valores del gráfico de barras
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#1cc910',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 2,
    color: (opacity: number = 1): string => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity: number = 1): string => `rgba(0, 0, 0, ${opacity})`,

    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };


  const openComponentModal = (item: Componente) => {
    setSelectedComponente(item);
    setComponentModalVisible(true);
  };

  // Filtrar, ordenar y limitar los componentes
  const componentesFiltrados = componentesBajos
    .filter((componente) => componente.cantidad < componente.limite) // Filtrar por debajo del límite
    .sort((a, b) => {
      // Ordenar por fecha primero y luego por hora
      const fechaA = new Date(`${a.fechaIncidencia}T${dayjs(a.horaIncidencia, 'hh:mm A').format('HH:mm:ss')}`);
      const fechaB = new Date(`${b.fechaIncidencia}T${dayjs(b.horaIncidencia, 'hh:mm A').format('HH:mm:ss')}`);
      return fechaA.getTime() - fechaB.getTime();
    })
    .slice(0, 2); // Limitar a un máximo de 2 componentes

  const renderComponente = ({ item }: { item: Componente }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => openComponentModal(item)}>
      <View style={styles.iconContainer}>
        <Feather name="alert-circle" size={35} color="#f2b705" />
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.titulo}</Text>
        <Text style={styles.eventTime}>{item.horaIncidencia}</Text>
      </View>
    </TouchableOpacity>
  );

  return (


    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={require('../assets/UTPL_Box_Logo2.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => navigation.navigate('Noti')}>
            {hasNotifications ? (
              <MaterialCommunityIcons
                name="bell-badge"
                size={28}
                color="#febe10"
              />
            ) : (
              <MaterialCommunityIcons
                name="bell"
                size={28}
                color="#febe10"
              />
            )}
          </TouchableOpacity>
        </View>


      </View>

      {/* Subheader */}
      <View style={styles.subHeader}>
        <Text style={styles.welcomeText}>Bienvenido/a Carlos</Text>
      </View>

      {/* Calendario */}
      {/* Controles de la semana */}
      <View style={styles.weekControls}>
        <TouchableOpacity onPress={goToPreviousWeek}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#004B87" />
        </TouchableOpacity>
        <Text style={styles.weekText}>
          {currentWeek[0].format('DD MMM')} - {currentWeek[6].format('DD MMM YYYY')}
        </Text>
        <TouchableOpacity onPress={goToNextWeek}>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#004B87" />
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View >
        <FlatList
          data={currentWeek}
          numColumns={7}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => {
            const isSelected = item.isSame(selectedDate, 'day');
            return (
              <TouchableOpacity onPress={() => setSelectedDate(item)} style={styles.dayContainer}>
                <Text style={[styles.dayOfWeek, isSelected && styles.selectedText]}>
                  {item.format('ddd').toUpperCase()}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                  {item.format('D')}
                </Text>
              </TouchableOpacity>
            );
          }}
          scrollEnabled={false}
        />
      </View>

      {/* Lista de eventos */}
      <Text style={styles.eventsTitle}>Próximos eventos</Text>
      <FlatList
        data={proximosEventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard} onPress={() => handleEventPress(item)}>
            <View style={styles.iconContainer}>
              <Feather name="calendar" size={35} color="#004B87" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text style={styles.eventTime}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay} >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡AUDITORÍA PROGRAMADA!</Text>
            <View style={styles.iconContainer2}>
              <Feather name="alert-circle" size={60} color="#004270" />
            </View>
            {selectedEvent && (
              <>
                <View style={styles.containerModalText}>
                  <Text style={styles.modalText}>
                    Fecha Programada: {selectedEvent.date}
                  </Text>
                  <Text style={styles.modalText}>
                    Hora Programada: {selectedEvent.startTime} a{" "}
                    {selectedEvent.endTime}
                  </Text>
                </View>
              </>
            )}
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text style={styles.eventsTitle}>Componentes Bajos</Text>
      <FlatList
        data={componentesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderComponente}
        scrollEnabled={false}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={componentModalVisible}
        onRequestClose={() => setComponentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡COMPONENTE BAJO!</Text>
            <View style={styles.iconContainer2}>
              <Feather name="alert-circle" size={60} color="#004270" />
            </View>
            {selectedComponente && (
              <>
                <View style={styles.containerModalText}>
                  <Text style={styles.modalText}>Nombre del componente: {selectedComponente.nombre}</Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalText}>Código de barras: </Text>
                    {selectedComponente.codigoBarras}
                  </Text>
                  <Text style={styles.modalText}>
                    <Text style={styles.modalText}>Hora de incidencia: </Text>
                    {selectedComponente.horaIncidencia}
                  </Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setComponentModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      {/* Componentes por Tipo */}
      <Text style={styles.sectionTitle}>Componentes por Tipo</Text>
      <View style={[styles.graphPie, { flexDirection: 'row', alignItems: 'center' }]}>
        {/* Gráfico de pastel reducido */}
        <Svg width={radius} height={radius}>
          <G x={radius / 2} y={radius / 2}>
            {componentesPorTipo.map((item, index) => {
              const sliceAngle = (item.cantidad / totalCantidad) * 360;
              const endAngle = startAngle + sliceAngle;
              const largeArcFlag = sliceAngle > 180 ? 1 : 0;

              const x1 = (radius / 2) * Math.cos((startAngle * Math.PI) / 180);
              const y1 = (radius / 2) * Math.sin((startAngle * Math.PI) / 180);
              const x2 = (radius / 2) * Math.cos((endAngle * Math.PI) / 180);
              const y2 = (radius / 2) * Math.sin((endAngle * Math.PI) / 180);

              const pathData = `
          M 0 0 
          L ${x1} ${y1} 
          A ${radius / 2} ${radius / 2} 0 ${largeArcFlag} 1 ${x2} ${y2} 
          Z
        `;

              // Calcular el ángulo medio para posicionar el porcentaje
              const midAngle = startAngle + sliceAngle / 2;
              const percentX = (radius / 3) * Math.cos((midAngle * Math.PI) / 180);
              const percentY = (radius / 3) * Math.sin((midAngle * Math.PI) / 180);

              const percentage = ((item.cantidad / totalCantidad) * 100).toFixed(1);

              startAngle += sliceAngle;

              return (
                <React.Fragment key={index}>
                  <Path
                    d={pathData}
                    fill={generateBlueShade(index, componentesPorTipo.length)}
                  />
                  {/* Texto del porcentaje */}
                  <SvgText
                    x={percentX}
                    y={percentY}
                    fontSize={10}
                    fill="#000"
                    textAnchor="middle"
                  >
                    {`${percentage}%`}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </G>
        </Svg>

        {/* Leyenda a la derecha */}
        <View style={[styles.legendContainer, { display: 'flex', marginLeft: 20 }]}>
          {componentesPorTipo.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.colorBox,
                  {
                    backgroundColor: generateBlueShade(index, componentesPorTipo.length),
                    borderRadius: 10, // Hace que sea circular
                    width: 12,
                    height: 12,
                  },
                ]}
              />
              <Text style={styles.legendText}>{`${item.tipo}: ${item.cantidad}`}</Text>
            </View>
          ))}
        </View>
      </View>


      {/* Últimos Movimientos */}
      <View style={styles.movementsHeader}>
        <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.viewMore}>Ver más »</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={ultimosMovimientos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.movementCard}>
            <MaterialCommunityIcons
              name={item.tipo === 'agregado' ? 'arrow-up' : 'arrow-down'}
              size={24}
              color={item.tipo === 'agregado' ? 'green' : 'red'}
            />
            <View style={styles.movementInfo}>
              <Text style={styles.movementDescription}>{item.descripcion}</Text>
              <Text style={styles.movementDate}>{item.fecha}</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />

      {/* Ingresos y egresos por mes */}
      <Text style={styles.sectionTitle}>Ingresos y Egresos por Mes</Text>
      <BarChart
        data={data}
        width={screenWidth - 40}  // Ajustar el ancho del gráfico
        height={220}
        yAxisLabel="$" // Prefijo en el eje Y
        yAxisSuffix="k" // Sufijo en el eje Y (por ejemplo, miles)
        chartConfig={chartConfig}
        verticalLabelRotation={30}  // Rotación de las etiquetas en el eje X
        fromZero={true}
      />

    </ScrollView>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    paddingTop: 20,
  },
  header: {
    paddingTop: 50,
    flexDirection: 'row', // Alinear elementos horizontalmente
    justifyContent: 'space-between', // Distribuir espacio entre elementos
    alignItems: 'center', // Centrar elementos verticalmente
    backgroundColor: '#f4f4f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    color: '#004B87',
    fontSize: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Alinear contenido a la derecha
  },
  logo: {
    width: 150, // Ajustar el tamaño del logo según necesidad
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTitle: {
    color: '#004B87',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationIcon: {
    fontSize: 24,
    color: '#FFC107',
  },
  subHeader: {
    alignItems: 'flex-end',
    paddingRight: 40,
  },
  welcomeText: {
    textAlign: 'right',
    color: '#004270',
    fontSize: 18,
    fontWeight: 'bold',
    alignContent: 'flex-end',
  },

  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2b705',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer2: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventInfo: {
    fontSize: 10,
    marginLeft: 12,
  },
  eventTitle: {
    fontWeight: 'bold',
    color: '#004B87',
    alignItems: 'stretch',
  },
  eventDate: {
    color: '#757575',
  },
  eventTime: {
    color: '#757575',
  },

  //Estilos de alerta de eventos
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end", // Posiciona el modal en la parte inferior
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
  },
  modalContent: {
    backgroundColor: "#ffffff", // Fondo blanco
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366", // Azul oscuro
    marginBottom: 10,
    textAlign: "center",
  },
  containerModalText: {
    alignItems: 'flex-start',
  },
  modalText: {
    fontSize: 15,
    color: "#333333", // Texto gris oscuro
    marginBottom: 10,
    textAlign: "justify",
    justifyContent: "flex-start",
  },
  modalButton: {
    backgroundColor: "#004270", // Azul intenso
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 20,
    paddingHorizontal: 20,
    alignSelf: "auto", // Ocupa el ancho disponible
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff", // Blanco para el texto del botón
  },
  weekControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c2cede',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
  },
  weekText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  dayOfWeek: {
    color: '#838383',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayNumber: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#004270', // Color personalizado para el día seleccionado
    fontWeight: 'bold',
  },
  componentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  componentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  componentQuantity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004B87',
  },

  // Últimos Movimientos
  movementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  movementCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  movementInfo: {
    marginLeft: 12,
    flex: 1,
  },
  movementDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginBottom: 4,
  },
  movementDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  viewMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004B87',
  },
  graphPie: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    borderRadius: 10,
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#000',
  },

});

