import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function ComenzarScreen(){
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [plan, setPlan] = useState<string>('basico_price'); // default priceId

  // Mapea planes a priceIds reales de Stripe
  const planesDisponibles: { nombre: string; priceId: string }[] = [
    { nombre: 'Básico', priceId: 'basico_price' },
    { nombre: 'Estándar', priceId: 'estandar_price' },
    { nombre: 'Premium', priceId: 'premium_price' },
  ];

  const handleCrearCuenta = async (): Promise<void> => {
    if (!nombre || !email || !password || !plan) {
      Alert.alert('Faltan datos', 'Por favor completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          priceId: plan,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Cuenta creada', `Bienvenido/a ${nombre}`);
        console.log('Respuesta:', data);
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear la cuenta.');
      }
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Selecciona un plan:</Text>
        {planesDisponibles.map((opcion) => (
          <View key={opcion.priceId} style={styles.planButton}>
            <Button
              title={plan === opcion.priceId ? `✓ ${opcion.nombre}` : opcion.nombre}
              onPress={() => setPlan(opcion.priceId)}
              color={plan === opcion.priceId ? '#1976D2' : undefined}
            />
          </View>
        ))}

        <View style={styles.submitButton}>
          <Button title="Crear Cuenta" onPress={handleCrearCuenta} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F1F5F9',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  planButton: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});
