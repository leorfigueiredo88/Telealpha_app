import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importação das telas que criamos
import GestorScreen from './screens/GestorScreen';
import PerfilScreen from './screens/PerfilScreen';
import RelatorioScreen from './screens/RelatorioScreen';

const Tab = createBottomTabNavigator();

export default function GestorRoutes({ route }) {
  // Recebe os dados do gestor vindos do Login
  const { usuario } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Configuração dos ícones das abas
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Frota') {
            iconName = focused ? 'bus' : 'bus-outline';
          } else if (route.name === 'Relatorios') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#003366', // Azul marinho padrão
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Ocultamos o header padrão pois as telas já têm seus próprios headers
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Frota" 
        component={GestorScreen} 
        options={{ title: 'Gestão' }}
      />
      
      <Tab.Screen 
        name="Relatorios" 
        component={RelatorioScreen} 
        options={{ title: 'Relatórios' }}
      />

      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        initialParams={{ usuario }}
        options={{ title: 'Meu Perfil' }}
      />
    </Tab.Navigator>
  );
}