import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';


const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tus credenciales');
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        navigation.navigate('Home');
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/UTPL_Box_Logo.png')} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.mailFont}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="example@utpl.edu.ec"
          placeholderTextColor="#A9A9A9"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.passwordFont}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Recupera tu contraseña</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  logoContainer: {
    width: '100%',
    height: '35%',
    backgroundColor: '#004270',
    justifyContent: 'center',
    alignItems: 'center',
    borderEndEndRadius: 20,
    borderStartEndRadius: 20,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.04,
  },
  mailFont: {
    width: '90%',
    fontSize: 20,
    color: '#004270',
    marginBottom: height * 0.005,
  },
  input: {
    width: '90%',
    height: height * 0.06,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginVertical: height * 0.01,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  passwordFont: {
    width: '90%',
    fontSize: 20,
    color: '#004270',
    marginBottom: height * 0.005,
  },
  forgotPasswordContainer: {
    width: '90%',
    alignItems: 'flex-end',
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  forgotPassword: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  button: {
    height: height * 0.06,
    width: '75%',
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginTop: height * 0.06,
  },
  buttonText: {
    color: '#004270',
    fontWeight: 'bold',
    fontSize: height * 0.02,
  },
});

export default LoginScreen;
