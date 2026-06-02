import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Platform, Animated, Image } from 'react-native';
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

  const [showSplash, setShowSplash] = useState(true);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Pulsating pop animation loop for the centered Ronin logo container
  useEffect(() => {
    if (!showSplash) return;
    
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, [showSplash]);

  const handleWebViewLoadEnd = () => {
    console.log('✅ WebView Content Loaded Successfully');
    // Smoothly fade out the splash screen overlay once the React webapp compiles and loads
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowSplash(false);
    });
  };

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
        onLoadEnd={handleWebViewLoadEnd}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('❌ WebView error: ', nativeEvent);
        }}
      />

      {/* Premium Pulsating Native Splash Screen overlay */}
      {showSplash && (
        <Animated.View style={[styles.splashOverlay, { opacity: fadeAnim }]} pointerEvents="none">
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Image
              source={require('./assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>
      )}
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
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000', // Entirely black screen
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logoContainer: {
    backgroundColor: '#121214', // Rounded dark container hiding the gray png background
    borderRadius: 24,
    padding: 20,
    // Whitish glow shadow (Android/iOS compatible)
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
});
