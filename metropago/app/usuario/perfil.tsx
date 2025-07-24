import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PerfilUsuario() {
  const params = useLocalSearchParams();

  const getParam = (key: string, defaultValue: string): string => {
    const value = params[key];
    if (typeof value === 'string') {
      return decodeURIComponent(value);
    }
    return defaultValue;
  };  

  const nombre = getParam('nombre', 'Usuario');
  const email = getParam('email', 'usuario@example.com');
  const plan = getParam('plan', 'Semanal');

  const historialPagos = [
    { id: '1', fecha: '2025-07-01', monto: '$149.00', plan: 'Semanal' },
    { id: '2', fecha: '2025-06-01', monto: '$149.00', plan: 'Semanal' },
    { id: '3', fecha: '2025-05-01', monto: '$149.00', plan: 'Semanal' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: `https://api.dicebear.com/7.x/identicon/png?seed=${nombre}`,
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 6,
  },
  planName: {
    fontWeight: '700',
    color: '#2563eb',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  thankYou: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    width: '100%',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pagoItem: {
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pagoTexto: {
    fontSize: 14,
    color: '#334155',
  },
});
