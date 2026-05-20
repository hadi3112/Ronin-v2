import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

// Dev server fallback URL (useful for hot-reloading in emulators / Expo Go)
// Replace with your local machine's IP address (e.g., http://192.168.1.100:5173) if testing on a physical device.
const DEV_SERVER_URL = 'http://192.168.100.50:5173';

// Set this to true to force loading the local bundled static files for offline testing
const FORCE_OFFLINE_STANDALONE = false;

export default function App() {
  const isDev = __DEV__ && !FORCE_OFFLINE_STANDALONE;

  // Select the appropriate source for the WebView
  const getSource = () => {
    if (isDev) {
      console.log(`🌐 Expo WebView: Connecting to dev server at ${DEV_SERVER_URL}`);
      return { uri: DEV_SERVER_URL };
    }

    console.log('📦 Expo WebView: Connecting to locally bundled offline web assets...');
    if (Platform.OS === 'android') {
      // Standalone Android builds access local assets folder directly in APK
      return { uri: 'file:///android_asset/www/index.html' };
    }

    // Standalone iOS loads the file bundle
    return require('./assets/www/index.html');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0a0a0c" translucent={false} />
      <WebView
        source={getSource()}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        // Performance and canvas optimizations
        decelerationRate={0.998}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLoadEnd={() => console.log('✅ WebView Content Loaded Successfully')}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('❌ WebView error: ', nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c', // Dark color matching Ronin's aesthetic
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
