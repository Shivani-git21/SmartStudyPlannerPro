/**
 * ProgressBar.js - Visual Progress Indicator
 * 
 * An animated horizontal progress bar showing completion percentage.
 * Used on Home and Progress screens.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

/**
 * Progress Bar Component
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} height - Height of the progress bar
 * @param {boolean} showLabel - Whether to show percentage label
 * @param {object} style - Additional custom styles
 */
const ProgressBar = ({
    progress = 0,
    height = 12,
    showLabel = true,
    style
}) => {
    // Animated value for smooth progress transitions
    const animatedWidth = useRef(new Animated.Value(0)).current;

    // Ensure progress is within valid range
    const validProgress = Math.min(Math.max(progress, 0), 100);

    // Animate the progress bar when progress changes
    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: validProgress,
            duration: 500, // Animation duration in milliseconds
            useNativeDriver: false, // Width animation requires useNativeDriver: false
        }).start();
    }, [validProgress]);

    // Get color based on progress level
    const getProgressColor = () => {
        if (validProgress >= 75) return '#2ED573'; // Green - Great progress
        if (validProgress >= 50) return '#FFA502'; // Orange - Moderate progress
        if (validProgress >= 25) return '#FECA57'; // Yellow - Some progress
        return '#FF6B6B'; // Red - Low progress
    };

    return (
        <View style={[styles.container, style]}>
            {/* Progress bar track (background) */}
            <View style={[styles.track, { height }]}>
                {/* Animated fill */}
                <Animated.View
                    style={[
                        styles.fill,
                        {
                            height,
                            backgroundColor: getProgressColor(),
                            width: animatedWidth.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'],
                            }),
                        }
                    ]}
                />
            </View>

            {/* Optional percentage label */}
            {showLabel && (
                <Text style={styles.label}>{validProgress}%</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    track: {
        flex: 1,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    fill: {
        borderRadius: 10,
    },
    label: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
        minWidth: 45,
    },
});

export default ProgressBar;
