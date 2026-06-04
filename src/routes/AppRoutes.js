import { createStackNavigator } from '@react-navigation/stack'; // Mudamos para o padrão Stack

// Imports das Telas (Verifique se os nomes das pastas estão corretos)
import GestorScreen from '../screens/Gestor/GestorScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import MotoristaScreen from '../screens/Motorista/MotoristaScreen';

const Stack = createStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator 
      initialRouteName="Login" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Gestor" component={GestorScreen} />
      <Stack.Screen name="Motorista" component={MotoristaScreen} />
    </Stack.Navigator>
  );
}