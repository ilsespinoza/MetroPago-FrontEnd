import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Usuario = {
  nombre: string;
  email: string;
  plan?: string;
};

export default function PerfilUsuario() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Manejo seguro para id, puede ser string o string[]
  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    console.log("Buscando usuario con ID:", id);
    fetch(`http://192.168.1.23:3000/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Usuario no encontrado");
        return res.json();
      })
      .then((data: Usuario) => {
        setUsuario(data);
        setLoading(false);
      })
      .catch(() => {
        setUsuario(null);
        setLoading(false);
      });
  }, [id]);

  const handleLogout = () => {
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el usuario</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    );
  }

  // Datos de historial de pagos de ejemplo
  const historialPagos = [
    { id: "1", fecha: "2025-07-01", monto: "$149.00", plan: "Semanal" },
    { id: "2", fecha: "2025-06-01", monto: "$149.00", plan: "Semanal" },
    { id: "3", fecha: "2025-05-01", monto: "$149.00", plan: "Semanal" },
  ];

  const { nombre, email, plan = "Semanal" } = usuario;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://api.dicebear.com/7.x/identicon/png?seed=${encodeURIComponent(
              nombre
            )}`,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{nombre}</Text>
        <Text style={styles.role}>
          Plan: <Text style={styles.planName}>{plan}</Text>
        </Text>
        <Text style={styles.email}>📧 {email}</Text>
        <Text style={styles.thankYou}>¡Gracias por tu suscripción! 🎉</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Historial de pagos</Text>
        <FlatList
          data={historialPagos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.pagoItem}>
              <Text style={styles.pagoTexto}>
                {item.fecha} — {item.plan} — {item.monto}
              </Text>
            </View>
          )}
        />

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 6,
  },
  planName: {
    fontWeight: "700",
    color: "#2563eb",
  },
  email: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 10,
  },
  thankYou: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    width: "100%",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  pagoItem: {
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  pagoTexto: {
    fontSize: 14,
    color: "#334155",
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ef4444",
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

