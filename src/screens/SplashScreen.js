/**
 * SplashScreen.js - App Entry/Splash Screen
 * 
 * Displays the app name with a fade-in animation.
 * Automatically navigates to the Login screen after 2 seconds.
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    StatusBar
} from 'react-native';

/**
 * Splash Screen Component
 * @param {object} navigation - React Navigation prop for screen navigation
 */
const SplashScreen = ({ navigation }) => {
    // Animated values for fade and scale effects
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Start entrance animation when component mounts
        Animated.parallel([
            // Fade in animation
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            // Scale up animation
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to Login screen after 2 seconds
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [navigation, fadeAnim, scaleAnim]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

            {/* Animated App Name */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                {/* App Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>📚</Text>
                </View>

                {/* App Title */}
                <Text style={styles.title}>Smart Study</Text>
                <Text style={styles.titleBold}>Planner Pro</Text>

                {/* Tagline */}
                <Text style={styles.tagline}>Plan • Study • Succeed</Text>
            </Animated.View>

            {/* Loading indicator */}
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
                <View style={styles.loadingDot} />
                <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconText: {
        fontSize: 50,
    },
    title: {
        fontSize: 32,
        color: '#FFFFFF',
        fontWeight: '300',
        letterSpacing: 2,
    },
    titleBold: {
        fontSize: 36,
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: -4,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 16,
        letterSpacing: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 80,
    },
    loadingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 5,
    },
    loadingDotDelay1: {
        opacity: 0.8,
    },
    loadingDotDelay2: {
        opacity: 0.5,
    },
});

export default SplashScreen;
