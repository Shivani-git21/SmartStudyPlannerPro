/**
 * App.js - Main Application Entry Point
 * 
 * Smart Study Planner Pro
 * A professional study task management app built with React Native and Expo.
 * 
 * Features:
 * - Splash screen with animation
 * - User login with validation
 * - Dashboard with progress tracking
 * - Task creation with subject, topic, time, deadline, priority
 * - Task list with completion toggle
 * - Progress visualization
 * 
 * Author: [Your Name]
 * For: College Final Assignment / Portfolio Showcase
 */

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main App Component
 * Simplified setup for better Expo SDK 54 compatibility
 */
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Set default status bar style */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4A90E2"
      />

      {/* Main Navigation */}
      <AppNavigator />
    </View>
  );
}
