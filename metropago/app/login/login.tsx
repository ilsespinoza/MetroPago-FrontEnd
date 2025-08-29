import React, { JSX, useState, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image } from "react-native";

const logo = require("../../assets/images/logo1.png");

export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const BASE_URL =
    Platform.OS === "ios"
      ? "http://127.0.0.1:3000" 
      : "http://192.168.1.23:3000"; 

  const handleStart = () => {
    router.push("/comenzar");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor llena todos los campos");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciales inválidas");
      }

      const data = await response.json();

      if (!data.access_token) {
        throw new Error("Token no recibido");
      }

      await AsyncStorage.setItem("token", data.access_token);
      router.replace(`/usuario/perfil?id=${data.user.id}`);
    } catch (error: any) {
      alert(error.message || "Error desconocido");
    }
  };

  // Animación del botón
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>MeteoAlert</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Pressable
            onPress={handleLogin}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#c20000" : "#8B0000",
              },
              styles.button,
            ]}
          >
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>
        </Animated.View>

        <View style={{ marginTop: 20 }}>
          <Button title="Crear cuenta" onPress={handleStart} color="#A52019" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#8B0000",
  },
  form: {},
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    color: "#111827",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#3c0000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
});



