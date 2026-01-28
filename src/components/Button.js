/**
 * Button.js - Reusable Button Component
 * 
 * A styled button component used throughout the app
 * with consistent styling and touch feedback.
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

/**
 * Custom Button Component
 * @param {string} title - Button text
 * @param {function} onPress - Function to call when button is pressed
 * @param {string} variant - Button style variant ('primary', 'secondary', 'outline')
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} loading - Show loading spinner
 * @param {object} style - Additional custom styles
 */
const Button = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style
}) => {
    // Get button styles based on variant
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'outline':
                return styles.outlineButton;
            default:
                return styles.primaryButton;
        }
    };

    // Get text styles based on variant
    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.outlineText;
            default:
                return styles.buttonText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                disabled && styles.disabledButton,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                // Show loading spinner when loading
                <ActivityIndicator
                    color={variant === 'outline' ? '#4A90E2' : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <Text style={[getTextStyle(), disabled && styles.disabledText]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    // Primary button - Main action button
    primaryButton: {
        backgroundColor: '#4A90E2',
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    // Secondary button - Alternative action
    secondaryButton: {
        backgroundColor: '#6C5CE7',
    },
    // Outline button - Less prominent action
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    // Disabled button state
    disabledButton: {
        backgroundColor: '#A0AEC0',
        shadowOpacity: 0,
        elevation: 0,
    },
    // Button text styles
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    outlineText: {
        color: '#4A90E2',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    disabledText: {
        color: '#E2E8F0',
    },
});

export default Button;
