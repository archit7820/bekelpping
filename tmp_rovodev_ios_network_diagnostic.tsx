// iOS Network Diagnostic Component
// Add this temporarily to your app to diagnose network issues

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function IOSNetworkDiagnostic() {
  const [diagnosticResults, setDiagnosticResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setDiagnosticResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    
    addResult(`🍎 Starting iOS Network Diagnostics on ${Platform.OS} ${Platform.Version}`);
    
    try {
      // Test 1: Network connectivity
      addResult('📡 Checking network connectivity...');
      const netState = await NetInfo.fetch();
      addResult(`📡 Network Type: ${netState.type}`);
      addResult(`📡 Is Connected: ${netState.isConnected}`);
      addResult(`📡 Is Internet Reachable: ${netState.isInternetReachable}`);
      
      if (!netState.isConnected) {
        addResult('❌ No network connection detected');
        Alert.alert('Network Issue', 'No network connection detected. Please check your WiFi or cellular connection.');
        setIsRunning(false);
        return;
      }
      
      // Test 2: DNS Resolution
      addResult('🔍 Testing DNS resolution...');
      try {
        const dnsTest = await fetch('https://8.8.8.8/', { 
          method: 'HEAD',
          signal: AbortSignal.timeout(10000)
        });
        addResult('✅ DNS resolution working');
      } catch (dnsError) {
        addResult(`⚠️ DNS test failed: ${dnsError.message}`);
      }
      
      // Test 3: HTTPS connectivity
      addResult('🔒 Testing HTTPS connectivity...');
      try {
        const httpsTest = await fetch('https://httpbin.org/get', {
          method: 'GET',
          signal: AbortSignal.timeout(15000)
        });
        addResult(`✅ HTTPS test: ${httpsTest.status}`);
      } catch (httpsError) {
        addResult(`❌ HTTPS test failed: ${httpsError.message}`);
      }
      
      // Test 4: Backend connectivity - Basic ping
      addResult('🎯 Testing backend connectivity...');
      try {
        const backendTest = await fetch('https://kelp-backend.onrender.com/', {
          method: 'HEAD',
          headers: {
            'User-Agent': 'iOS-App-Diagnostic/1.0',
          },
          signal: AbortSignal.timeout(30000) // Longer timeout for Render.com
        });
        addResult(`✅ Backend reachable: ${backendTest.status}`);
      } catch (backendError) {
        addResult(`❌ Backend connectivity failed: ${backendError.message}`);
        
        if (backendError.name === 'AbortError') {
          addResult('💡 Timeout suggests Render.com cold start - try again in 30 seconds');
        }
      }
      
      // Test 5: API endpoint test
      addResult('🔌 Testing signup API endpoint...');
      try {
        const apiTest = await fetch('https://kelp-backend.onrender.com/api/auth/signup', {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:8081', // Expo origin
          },
          signal: AbortSignal.timeout(30000)
        });
        addResult(`✅ API endpoint test: ${apiTest.status}`);
        
        // Check CORS headers
        const corsHeaders = apiTest.headers.get('access-control-allow-origin');
        addResult(`🔧 CORS headers: ${corsHeaders || 'None'}`);
        
      } catch (apiError) {
        addResult(`❌ API endpoint test failed: ${apiError.message}`);
      }
      
      // Test 6: Actual signup request
      addResult('📝 Testing actual signup request...');
      try {
        const signupTest = await fetch('https://kelp-backend.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'iOS-App/1.0',
          },
          body: JSON.stringify({
            email: 'ios.diagnostic.test@example.com',
            password: 'TestPassword123!'
          }),
          signal: AbortSignal.timeout(30000)
        });
        
        const signupData = await signupTest.json();
        addResult(`📝 Signup test: ${signupTest.status}`);
        addResult(`📝 Response: ${JSON.stringify(signupData, null, 2)}`);
        
        if (signupTest.status === 400 && signupData.error?.includes('invalid')) {
          addResult('✅ API working - email validation working as expected');
          
          Alert.alert(
            'Success! 🎉', 
            'Your iOS device can successfully connect to the backend! The API is working correctly.',
            [{ text: 'Great!', style: 'default' }]
          );
        }
        
      } catch (signupError) {
        addResult(`❌ Signup test failed: ${signupError.message}`);
        
        Alert.alert(
          'Network Issue Detected',
          `Cannot reach backend API. Error: ${signupError.message}\n\nTry:\n1. Switch between WiFi and Cellular\n2. Wait 30 seconds (backend cold start)\n3. Check if other apps can access internet`,
          [{ text: 'OK', style: 'default' }]
        );
      }
      
    } catch (error) {
      addResult(`❌ Diagnostic error: ${error.message}`);
    }
    
    setIsRunning(false);
    addResult('✅ Diagnostics complete');
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        🍎 iOS Network Diagnostics
      </Text>
      
      <TouchableOpacity
        onPress={runDiagnostics}
        disabled={isRunning}
        style={{
          backgroundColor: isRunning ? '#ccc' : '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {isRunning ? 'Running Diagnostics...' : 'Run Network Diagnostics'}
        </Text>
      </TouchableOpacity>
      
      <View style={{ backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, minHeight: 200 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Diagnostic Results:</Text>
        {diagnosticResults.length === 0 && (
          <Text style={{ fontStyle: 'italic', color: '#666' }}>
            Tap "Run Network Diagnostics" to start testing...
          </Text>
        )}
        {diagnosticResults.map((result, index) => (
          <Text key={index} style={{ fontSize: 12, fontFamily: 'monospace', marginBottom: 3 }}>
            {result}
          </Text>
        ))}
      </View>
      
      <View style={{ marginTop: 20, padding: 15, backgroundColor: '#e8f4fd', borderRadius: 8 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>💡 Common iOS Network Issues:</Text>
        <Text style={{ fontSize: 14, marginBottom: 3 }}>• Network Security: iOS blocks HTTP requests</Text>
        <Text style={{ fontSize: 14, marginBottom: 3 }}>• Cold Start: Render.com takes 30+ seconds to wake up</Text>
        <Text style={{ fontSize: 14, marginBottom: 3 }}>• CORS: Backend must allow mobile origins</Text>
        <Text style={{ fontSize: 14, marginBottom: 3 }}>• Timeout: Mobile networks can be slower</Text>
      </View>
    </ScrollView>
  );
}

// Installation note:
// You'll need: npm install @react-native-community/netinfo