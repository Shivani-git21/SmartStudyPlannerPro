/**
 * TaskCard.js - Task Display Card Component
 * 
 * Displays individual task information in a card layout.
 * Includes subject, topic, time, deadline, priority and completion toggle.
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../utils/helpers';

/**
 * Task Card Component
 * @param {object} task - Task object with all task details
 * @param {function} onToggleComplete - Function to toggle task completion
 * @param {function} onPress - Function called when card is pressed
 */
const TaskCard = ({ task, onToggleComplete, onPress }) => {
    // Destructure task properties for easier access
    const {
        id,
        subject,
        topic,
        studyTime,
        deadline,
        priority,
        completed
    } = task;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                completed && styles.completedCard // Apply different style if completed
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Card Header - Subject and Priority */}
            <View style={styles.header}>
                <Text
                    style={[
                        styles.subject,
                        completed && styles.completedText
                    ]}
                    numberOfLines={1}
                >
                    {subject}
                </Text>
                <PriorityBadge priority={priority} />
            </View>

            {/* Topic Name */}
            <Text
                style={[
                    styles.topic,
                    completed && styles.completedText
                ]}
                numberOfLines={2}
            >
                {topic}
            </Text>

            {/* Task Details Row */}
            <View style={styles.detailsRow}>
                {/* Study Time */}
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>⏱️ Time</Text>
                    <Text style={[styles.detailValue, completed && styles.completedText]}>
                        {studyTime} {studyTime === 1 ? 'hour' : 'hours'}
                    </Text>
                </View>

                {/* Deadline */}
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>📅 Deadline</Text>
                    <Text style={[styles.detailValue, completed && styles.completedText]}>
                        {formatDate(deadline)}
                    </Text>
                </View>
            </View>

            {/* Completion Toggle Button */}
            <TouchableOpacity
                style={[
                    styles.completeButton,
                    completed && styles.completedButton
                ]}
                onPress={() => onToggleComplete(id)}
            >
                <Text style={styles.completeButtonText}>
                    {completed ? '✓ Completed' : 'Mark Complete'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        // Shadow for Android
        elevation: 4,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    // Completed card has different appearance
    completedCard: {
        backgroundColor: '#F0FFF4',
        borderWidth: 2,
        borderColor: '#2ED573',
        opacity: 0.85,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subject: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
        flex: 1,
        marginRight: 12,
    },
    topic: {
        fontSize: 14,
        color: '#718096',
        marginBottom: 12,
        lineHeight: 20,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#A0AEC0',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    detailItem: {
        flexDirection: 'column',
    },
    detailLabel: {
        fontSize: 12,
        color: '#A0AEC0',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
    },
    completeButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    completedButton: {
        backgroundColor: '#2ED573',
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default TaskCard;
