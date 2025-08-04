import React, { useState } from "react";
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
  Modal,
  Linking,
} from "react-native";

export default function ComenzarScreen() {
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("price_1RlI9jPKNWjJLZi9ywBM9GKo");

  const [modalVisible, setModalVisible] = useState(false);
  const [metodoPago, setMetodoPago] = useState("card");

  const planesDisponibles = [
    { nombre: "Semanal", priceId: "price_1RlI9jPKNWjJLZi9ywBM9GKo", precio: "$10 MXN" },
    { nombre: "Mensual", priceId: "price_1RlKi7PKNWjJLZi9DF8h8D4a", precio: "$50 MXN" },
    { nombre: "Bimensual", priceId: "price_1RlKjjPKNWjJLZi9PTB3eOOs", precio: "$100 MXN" },
    { nombre: "Semestral", priceId: "price_1RlKmNPKNWjJLZi9lTleDTfj", precio: "$300 MXN" },
    { nombre: "Anual", priceId: "price_1RlKnbPKNWjJLZi9rX5SLPu1", precio: "$600 MXN" },
  ];

  const handleCrearCuenta = async () => {
    if (!nombre || !email || !password || !plan) {
      Alert.alert("Faltan datos", "Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          priceId: plan,
          ciudad,
          apellido,
          telefono,
          metodoPago,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (metodoPago === "card") {
          if (data.checkoutUrl) {
            Alert.alert("Redirigiendo a pago...");
            Linking.openURL(data.checkoutUrl);
          } else {
            Alert.alert("Error", "No se pudo iniciar el pago.");
          }
        } else if (metodoPago === "transfer") {
          // Mostrar instrucciones SPEI recibidas del backend
          if (data.clabe && data.banco && data.beneficiario && data.monto && data.moneda) {
            Alert.alert(
              "Instrucciones SPEI",
              `Realiza la transferencia a:\n\nBanco: ${data.banco}\nCLABE: ${data.clabe}\nBeneficiario: ${data.beneficiario}\nMonto: ${data.monto} ${data.moneda}`
            );
          } else {
            Alert.alert("Error", "No se recibieron instrucciones SPEI.");
          }
        }
      } else {
        Alert.alert("Error", data.message || "No se pudo crear la cuenta.");
      }
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Crear tu cuenta</Text>
            <Image
              source={require("@/assets/images/logo1.png")}
              style={styles.logoSmall}
              resizeMode="contain"
            />
          </View>

          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
          <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} />
          <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} />
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
                style={[styles.planOption, plan === opcion.priceId && styles.planSelected]}
                onPress={() => setPlan(opcion.priceId)}
              >
                <Text style={[styles.planText, plan === opcion.priceId && styles.planTextSelected]}>{opcion.nombre}</Text>
                <Text style={[styles.planPrice, plan === opcion.priceId && styles.planTextSelected]}>{opcion.precio}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de selección de método de pago */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecciona el método de pago</Text>

            <ScrollView style={styles.scrollViewContainer} contentContainerStyle={{ paddingVertical: 10 }}>
              {/* Opción habilitada: Tarjeta */}
              <TouchableOpacity
                style={[styles.paymentOption, metodoPago === "card" && styles.paymentSelected]}
                onPress={() => setMetodoPago("card")}
              >
                <Text style={[styles.paymentText, metodoPago === "card" && styles.paymentTextSelected]}>
                  Tarjeta de crédito / débito
                </Text>
              </TouchableOpacity>

              {/* Opción habilitada: Transferencia SPEI */}
              <TouchableOpacity
                style={[styles.paymentOption, metodoPago === "transfer" && styles.paymentSelected]}
                onPress={() => setMetodoPago("transfer")}
              >
                <Text style={[styles.paymentText, metodoPago === "transfer" && styles.paymentTextSelected]}>
                  Transferencia SPEI
                </Text>
              </TouchableOpacity>

              {/* Opción deshabilitada: Efectivo */}
              <View style={styles.disabledOption}>
                <Text style={styles.disabledText}>Pago en efectivo (OXXO)</Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => {
                  setModalVisible(false);
                  handleCrearCuenta();
                }}
              >
                <Text style={styles.confirmText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 480,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logoSmall: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "#374151",
  },
  planContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  planOption: {
    width: "48%",
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    alignItems: "center",
  },
  planSelected: {
    backgroundColor: "#3b82f6",
  },
  planText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  planPrice: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  planTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxHeight: 350,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  scrollViewContainer: {
    maxHeight: 220,
  },
  paymentOption: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentSelected: {
    backgroundColor: "#2563eb",
  },
  paymentText: {
    fontSize: 16,
    color: "#111827",
  },
  paymentTextSelected: {
    color: "#fff",
  },
  disabledOption: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    opacity: 0.6,
    alignItems: "center",
  },
  disabledText: {
    fontSize: 16,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },
  cancelText: {
    color: "#6b7280",
    fontSize: 16,
  },
  modalConfirmButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});

