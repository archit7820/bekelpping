// Simple network test utility for iOS debugging
// Use this to test network connectivity before API calls

export const testNetworkConnectivity = async (): Promise<{
  success: boolean;
  message: string;
  details: string[];
}> => {
  const details: string[] = [];
  
  try {
    details.push('🔍 Starting network connectivity test...');
    
    // Test 1: Basic HTTPS connectivity
    details.push('📡 Testing HTTPS connectivity...');
    try {
      const httpsResponse = await fetch('https://httpbin.org/get', {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      details.push(`✅ HTTPS working: ${httpsResponse.status}`);
    } catch (httpsError) {
      details.push(`❌ HTTPS failed: ${httpsError.message}`);
      return {
        success: false,
        message: 'Basic HTTPS connectivity failed. Check your internet connection.',
        details
      };
    }
    
    // Test 2: Backend connectivity with longer timeout for Render.com
    details.push('🎯 Testing backend connectivity...');
    try {
      const backendResponse = await fetch('https://kelp-backend.onrender.com/', {
        method: 'HEAD',
        headers: {
          'User-Agent': 'iOS-App/1.0',
        },
        signal: AbortSignal.timeout(30000) // 30 second timeout for cold start
      });
      details.push(`✅ Backend reachable: ${backendResponse.status}`);
    } catch (backendError) {
      details.push(`❌ Backend failed: ${backendError.message}`);
      
      if (backendError.name === 'AbortError') {
        return {
          success: false,
          message: 'Backend timeout - Render.com is cold starting. Please wait 30 seconds and try again.',
          details
        };
      } else {
        return {
          success: false,
          message: 'Cannot reach backend server. Check your internet connection.',
          details
        };
      }
    }
    
    // Test 3: API endpoint test
    details.push('🔌 Testing API endpoint...');
    try {
      const apiResponse = await fetch('https://kelp-backend.onrender.com/api/auth/signup', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });
      details.push(`✅ API endpoint working: ${apiResponse.status}`);
      
      return {
        success: true,
        message: 'Network connectivity test passed! Backend is reachable.',
        details
      };
      
    } catch (apiError) {
      details.push(`❌ API endpoint failed: ${apiError.message}`);
      return {
        success: false,
        message: 'API endpoint not accessible. Backend may be down or starting up.',
        details
      };
    }
    
  } catch (error) {
    details.push(`❌ Test error: ${error.message}`);
    return {
      success: false,
      message: 'Network test failed with error.',
      details
    };
  }
};

// Quick test function you can call before API requests
export const quickNetworkCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://kelp-backend.onrender.com/', {
      method: 'HEAD',
      signal: AbortSignal.timeout(15000)
    });
    return response.ok;
  } catch {
    return false;
  }
};