import React, { useState } from 'react';

let cameraStateListeners: ((isActive: boolean) => void)[] = [];
let isCameraActive = false;

export const useCameraState = () => {
  const [isActive, setIsActive] = useState(isCameraActive);

  const setCameraActive = (active: boolean) => {
    isCameraActive = active;
    cameraStateListeners.forEach(listener => listener(active));
  };

  // Subscribe to camera state changes
  React.useEffect(() => {
    const listener = (active: boolean) => setIsActive(active);
    cameraStateListeners.push(listener);
    
    return () => {
      const index = cameraStateListeners.indexOf(listener);
      if (index > -1) {
        cameraStateListeners.splice(index, 1);
      }
    };
  }, []);

  return { isActive, setCameraActive };
};

export const setCameraActive = (active: boolean) => {
  isCameraActive = active;
  cameraStateListeners.forEach(listener => listener(active));
};