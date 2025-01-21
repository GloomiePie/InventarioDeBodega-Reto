import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import dayjs from 'dayjs';
import { Svg, G, Circle, Text as SvgText } from 'react-native-svg';
import { BarChart } from 'react-native-chart-kit';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';

const { width: screenWidth, height } = Dimensions.get('window');

// Genera tonos de azul más oscuros en función del índice y la cantidad total de segmentos
const generateBlueShade = (index: number, total: number) => {
  const hue = 210; // Azul fijo en el espectro de colores HSL
  const saturation = 60; // Saturación fija en 60%
  const lightness = 60 - (index / total) * 50; // Luminosidad que disminuye para generar tonos más oscuros (60% a 30%)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Estructura de eventos
type Evento = {
  id: string;
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
};


const CustomCalendar: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState(dayjs()); // Fecha actual (primer día visible en la semana)
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Fecha seleccionada

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);

  const [hasNotifications, setHasNotifications] = useState(false);

  // Función para simular la detección de notificaciones
  const checkNotifications = () => {
    
    // Aquí puedes implementar la lógica real para verificar notificaciones
    // Por ahora simulamos con un valor booleano fijo o aleatorio
    const notificationsExist = Math.random() > 0.5; // Simulación (reemplazar con lógica real)
    setHasNotifications(notificationsExist);
  };

  // Efecto para comprobar notificaciones al montar el componente
  useEffect(() => {
    checkNotifications();
  }, []);

  // Datos quemados para eventos
  const eventos: Evento[] = [
    {
      id: "1",
      titulo: "Auditoría Programada",
      fecha: "25/12/2024",
      horaInicio: "9:00 am",
      horaFin: "10:00 am",
    },
    {
      id: "2",
      titulo: "Auditoría Programada",
      fecha: "01/01/2025",
      horaInicio: "3:00 pm",
      horaFin: "5:00 pm",
    },
  ];

  const handleEventPress = (event: Evento) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };


  // Datos quemados para "Componentes por Tipo"
  const componentesPorTipo = [
    { tipo: 'CPU', cantidad: 15, color: '#FF6384' },
    { tipo: 'Monitor', cantidad: 10, color: '#36A2EB' },
    { tipo: 'Teclado', cantidad: 25, color: '#FFCE56' },
    { tipo: 'Mouse', cantidad: 20, color: '#4BC0C0' },
    { tipo: 'Audifonos', cantidad: 30, color: '#2f2f2f' },
  ];

  const totalCantidad = componentesPorTipo.reduce((sum, item) => sum + item.cantidad, 0);
  const radius = 150;
  const strokeWidth = 20;

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
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => handleEventPress(item)}
          >
            <View style={styles.iconContainer}>
              <Feather name="alert-circle" size={35} color="#f2b705" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.titulo}</Text>
              <Text style={styles.eventDate}>{item.fecha}</Text>
              <Text style={styles.eventTime}>
                {item.horaInicio} - {item.horaFin}
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
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡AUDITORÍA PROGRAMADA!</Text>
            <View style={styles.iconContainer2}>
              <Feather name="alert-circle" size={60} color="#004270" />
            </View>
            {selectedEvent && (
              <>
                <View style={styles.containerModalText}>
                  <Text style={styles.modalText}>
                    Fecha Programada: {selectedEvent.fecha}
                  </Text>
                  <Text style={styles.modalText}>
                    Hora Programada: {selectedEvent.horaInicio} a{" "}
                    {selectedEvent.horaFin}
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
      {/* Componentes por Tipo */}
      <View style={styles.graphPie}>
        <Text style={styles.sectionTitle}>Componentes por Tipo</Text>
        <Svg width={radius * 2} height={radius * 2}>
          <G x={radius} y={radius}>
            {componentesPorTipo.map((item, index) => {
              const sliceAngle = (item.cantidad / totalCantidad) * 360;
              const endAngle = startAngle + sliceAngle;

              const largeArcFlag = sliceAngle > 180 ? 1 : 0;

              const x1 = radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = radius * Math.sin((endAngle * Math.PI) / 180);

              // Coordenadas para la etiqueta
              const midAngle = startAngle + sliceAngle / 2;
              const labelX = (radius - strokeWidth - 15) * Math.cos((midAngle * Math.PI) / 180);
              const labelY = (radius - strokeWidth - 15) * Math.sin((midAngle * Math.PI) / 180);

              startAngle += sliceAngle;

              return (
                <G key={index}>
                  <Circle
                    cx="0"
                    cy="0"
                    r={radius - strokeWidth / 2}
                    stroke={generateBlueShade(index, componentesPorTipo.length)}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * (radius - strokeWidth / 2)} ${2 * Math.PI * (radius - strokeWidth / 2)}`}
                    strokeDashoffset={-((startAngle - sliceAngle / 2) / 360) * 2 * Math.PI * (radius - strokeWidth / 2)}
                  />
                  {/* Etiqueta dentro del gráfico */}
                  <SvgText
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={12}
                    fill="#004B87"
                  >
                    {`${item.tipo}: ${item.cantidad}`}
                  </SvgText>
                </G>
              );
            })}
          </G>
        </Svg>
      </View>
      <View style={styles.legendContainer}>
        {componentesPorTipo.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{`${item.tipo}: ${item.cantidad}`}</Text>
          </View>
        ))}
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
    display: 'none', // Ocultar la leyenda externa
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },

});

