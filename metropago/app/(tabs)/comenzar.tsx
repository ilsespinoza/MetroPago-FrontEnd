import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Linking } from 'react-native';


export default function ComenzarScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('price_1RlI9jPKNWjJLZi9ywBM9GKo');

  const planesDisponibles = [
    { nombre: 'Semanal', priceId: 'price_1RlI9jPKNWjJLZi9ywBM9GKo', precio: '$10 MXN' },
    { nombre: 'Mensual', priceId: 'price_1RlKi7PKNWjJLZi9DF8h8D4a', precio: '$50 MXN' },
    { nombre: 'Bimensual', priceId: 'price_1RlKjjPKNWjJLZi9PTB3eOOs', precio: '$100 MXN' },
    { nombre: 'Semestral', priceId: 'price_1RlKmNPKNWjJLZi9lTleDTfj', precio: '$300 MXN' },
    { nombre: 'Anual', priceId: 'price_1RlKnbPKNWjJLZi9rX5SLPu1', precio: '$600 MXN' },
  ];

  const handleCrearCuenta = async () => {
    if (!nombre || !email || !password || !plan) {
      Alert.alert('Faltan datos', 'Por favor completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, priceId: plan }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.checkoutUrl) {
          Alert.alert('Redirigiendo a pago...');
          Linking.openURL(data.checkoutUrl);
        } else {
          Alert.alert('Error', 'No se pudo iniciar el pago.');
        }
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
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Crear tu cuenta</Text>
            <Image
              source={require('@/assets/images/metropago.png')}
              style={styles.logoSmall}
              resizeMode="contain"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
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

          <Text style={styles.label}>Selecciona un plan</Text>
          <View style={styles.planContainer}>
            {planesDisponibles.map((opcion) => (
              <TouchableOpacity
                key={opcion.priceId}
                style={[
                  styles.planOption,
                  plan === opcion.priceId && styles.planSelected,
                ]}
                onPress={() => setPlan(opcion.priceId)}
              >
                <Text
                  style={[
                    styles.planText,
                    plan === opcion.priceId && styles.planTextSelected,
                  ]}
                >
                  {opcion.nombre}
                </Text>
                <Text
                  style={[
                    styles.planPrice,
                    plan === opcion.priceId && styles.planTextSelected,
                  ]}
                >
                  {opcion.precio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCrearCuenta}>
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  logoSmall: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#374151',
  },
  planContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  planOption: {
    width: '48%',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  planSelected: {
    backgroundColor: '#3b82f6',
  },
  planText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  planPrice: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  planTextSelected: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
});


