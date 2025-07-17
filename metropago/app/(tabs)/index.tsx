import { Image } from 'expo-image';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/comenzar'); // Navega a la pantalla comenzar.tsx
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/metropago.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a la app!</Text>
      <Text style={styles.subtitle}>Gestiona tus datos fácilmente desde un solo lugar.</Text>

      <View style={styles.buttonContainer}>
        <Button title="Comenzar" onPress={handleStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '60%',
  },
});


