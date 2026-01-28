/**
 * PriorityBadge.js - Priority Indicator Component
 * 
 * A color-coded badge displaying task priority level.
 * Red for High, Orange for Medium, Green for Low.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPriorityColor } from '../utils/helpers';

/**
 * Priority Badge Component
 * @param {string} priority - Priority level ('Low', 'Medium', 'High')
 * @param {object} style - Additional custom styles
 */
const PriorityBadge = ({ priority, style }) => {
    // Get the appropriate color for the priority
    const backgroundColor = getPriorityColor(priority);

    return (
        <View style={[styles.badge, { backgroundColor }, style]}>
            <Text style={styles.badgeText}>
                {priority || 'Unknown'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default PriorityBadge;
