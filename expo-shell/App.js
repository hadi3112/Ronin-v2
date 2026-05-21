import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import { useAssets } from 'expo-asset';

// Dev server fallback URL (useful for hot-reloading in emulators / Expo Go)
const DEV_SERVER_URL = 'http://192.168.100.50:5173';

// Set this to true to force loading the local bundled static files for offline testing
const FORCE_OFFLINE_STANDALONE = true;

export default function App() {
  const isDev = __DEV__ && !FORCE_OFFLINE_STANDALONE;
  
  // This downloads/resolves the HTML file from the Metro bundle to the device cache
  const [assets] = useAssets([require('./assets/www/index.html')]);

  // Edge-to-edge is enabled in app.json, so we don't need to manually configure NavigationBar
  // Doing so crashes some Samsung devices due to SurfaceFlinger conflicts.
  useEffect(() => {
    // Nothing to do for navigation bar anymore
  }, []);

  // Select the appropriate source for the WebView
  const getSource = () => {
    if (isDev) {
      console.log(`🌐 Expo WebView: Connecting to dev server at ${DEV_SERVER_URL}`);
      return { uri: DEV_SERVER_URL };
    }

    if (assets && assets.length > 0) {
      console.log('📦 Expo WebView: Loading compiled single-file HTML asset: ', assets[0].localUri);
      return { uri: assets[0].localUri };
    }

    return { html: '<html><body style="background-color: #0a0a0c; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">Loading assets...</body></html>' };
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
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        webviewDebuggingEnabled={true}
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
