import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
      <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="index" />
            <Stack.Screen name="PerfilUsuario" />
            <Stack.Screen 
              name="home" 
            />
            <Stack.Screen name="TelaRegistro" />
            <Stack.Screen name="TelaRefeicoes" />
            <Stack.Screen name="Historico" />
            <Stack.Screen name="TelaPrevisoes" />
            <Stack.Screen name="TelaExportacao" />
            <Stack.Screen name="EditarUsuario" />
            <Stack.Screen name="acesso" />

          </Stack>
          

        <StatusBar style="auto" />

      </ThemeProvider>
  )
}
