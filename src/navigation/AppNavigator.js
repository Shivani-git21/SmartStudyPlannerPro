/**
 * AppNavigator.js - Navigation Configuration
 * 
 * Configures React Navigation stack navigator with all app screens.
 * Uses React Navigation v6 for better Expo SDK 54 compatibility.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TaskListScreen from '../screens/TaskListScreen';
import ProgressScreen from '../screens/ProgressScreen';

// Create stack navigator instance
const Stack = createStackNavigator();

/**
 * App Navigator Component
 * Wraps all screens in NavigationContainer with Stack Navigator
 */
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#4A90E2',
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                        fontWeight: '600',
                        fontSize: 18,
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                {/* Splash Screen - No header */}
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />

                {/* Login Screen - No header */}
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />

                {/* Home Dashboard - No header */}
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />

                {/* Add Task Screen */}
                <Stack.Screen
                    name="AddTask"
                    component={AddTaskScreen}
                    options={{
                        title: 'Add New Task',
                        headerStyle: {
                            backgroundColor: '#FFFFFF',
                            elevation: 2,
                        },
                        headerTintColor: '#4A90E2',
                    }}
                />

                {/* Task List Screen */}
                <Stack.Screen
                    name="TaskList"
                    component={TaskListScreen}
                    options={{
                        title: 'My Tasks',
                        headerStyle: {
                            backgroundColor: '#FFFFFF',
                            elevation: 2,
                        },
                        headerTintColor: '#4A90E2',
                    }}
                />

                {/* Progress Screen */}
                <Stack.Screen
                    name="Progress"
                    component={ProgressScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
