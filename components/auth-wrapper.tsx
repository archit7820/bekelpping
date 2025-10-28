import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthWrapperProps {
  children: React.ReactNode;
  colors?: string[];
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  colors = ['#667eea', '#764ba2', '#f093fb'] 
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});