/**
 * ProgressScreen.js - Progress Overview Screen
 * 
 * Displays overall study progress with visual progress bar
 * and detailed statistics about completed vs pending tasks.
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { getTasks } from '../utils/storage';
import { calculateProgress } from '../utils/helpers';

/**
 * Progress Screen Component
 * @param {object} navigation - React Navigation prop for screen navigation
 */
const ProgressScreen = ({ navigation }) => {
    // State
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Load tasks and calculate progress
     */
    const loadData = async () => {
        try {
            const storedTasks = await getTasks();
            setTasks(storedTasks);
            setProgress(calculateProgress(storedTasks));
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    };

    // Reload data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    /**
     * Handle pull-to-refresh
     */
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    // Calculate total study hours
    const totalHours = tasks.reduce((sum, t) => sum + (t.studyTime || 0), 0);
    const completedHours = tasks
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (t.studyTime || 0), 0);

    // Get motivational message based on progress
    const getMotivationalMessage = () => {
        if (progress === 100) {
            return { emoji: '🏆', message: 'Perfect! You\'ve completed all tasks!' };
        } else if (progress >= 75) {
            return { emoji: '🔥', message: 'Almost there! Keep pushing!' };
        } else if (progress >= 50) {
            return { emoji: '💪', message: 'Great progress! Stay focused!' };
        } else if (progress >= 25) {
            return { emoji: '📈', message: 'Good start! Keep going!' };
        } else if (progress > 0) {
            return { emoji: '🚀', message: 'You\'ve started! Let\'s build momentum!' };
        } else {
            return { emoji: '📋', message: 'Add tasks to start tracking progress!' };
        }
    };

    const motivation = getMotivationalMessage();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6C5CE7" />

            {/* Header with main progress */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Progress 📊</Text>

                {/* Large percentage display */}
                <View style={styles.progressCircle}>
                    <Text style={styles.progressPercentage}>{progress}%</Text>
                    <Text style={styles.progressLabel}>Complete</Text>
                </View>

                {/* Motivational message */}
                <View style={styles.motivationContainer}>
                    <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
                    <Text style={styles.motivationText}>{motivation.message}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#6C5CE7"
                    />
                }
            >
                {/* Progress Bar Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Overall Progress</Text>
                    <ProgressBar progress={progress} height={20} />
                    <Text style={styles.cardSubtext}>
                        {completedTasks} of {totalTasks} tasks completed
                    </Text>
                </View>

                {/* Statistics Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, styles.statPurple]}>
                        <Text style={styles.statNumber}>{totalTasks}</Text>
                        <Text style={styles.statLabel}>Total Tasks</Text>
                    </View>

                    <View style={[styles.statCard, styles.statGreen]}>
                        <Text style={styles.statNumber}>{completedTasks}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <View style={[styles.statCard, styles.statOrange]}>
                        <Text style={styles.statNumber}>{pendingTasks}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>

                    <View style={[styles.statCard, styles.statBlue]}>
                        <Text style={styles.statNumber}>{totalHours}</Text>
                        <Text style={styles.statLabel}>Total Hours</Text>
                    </View>
                </View>

                {/* Study Hours Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Study Hours</Text>
                    <View style={styles.hoursContainer}>
                        <View style={styles.hoursStat}>
                            <Text style={styles.hoursNumber}>{completedHours}</Text>
                            <Text style={styles.hoursLabel}>Hours Studied</Text>
                        </View>
                        <View style={styles.hoursDivider} />
                        <View style={styles.hoursStat}>
                            <Text style={styles.hoursNumber}>{totalHours - completedHours}</Text>
                            <Text style={styles.hoursLabel}>Hours Remaining</Text>
                        </View>
                    </View>

                    {/* Hours progress bar */}
                    <View style={styles.hoursProgressContainer}>
                        <ProgressBar
                            progress={totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}
                            height={10}
                            showLabel={false}
                        />
                        <Text style={styles.hoursProgressText}>
                            {totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0}% of study hours completed
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Button
                        title="View All Tasks"
                        onPress={() => navigation.navigate('TaskList')}
                        variant="secondary"
                        style={styles.actionButton}
                    />
                    <Button
                        title="Add New Task"
                        onPress={() => navigation.navigate('AddTask')}
                        style={styles.actionButton}
                    />
                </View>

                {/* Tips Card */}
                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>💡 Study Tips</Text>
                    <Text style={styles.tipText}>• Break large tasks into smaller chunks</Text>
                    <Text style={styles.tipText}>• Take short breaks every 25-30 minutes</Text>
                    <Text style={styles.tipText}>• Review completed tasks to reinforce learning</Text>
                    <Text style={styles.tipText}>• Prioritize high-priority tasks first</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    header: {
        backgroundColor: '#6C5CE7',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    progressCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    progressPercentage: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    progressLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: -4,
    },
    motivationContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    motivationEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    motivationText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: -20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
    },
    cardSubtext: {
        fontSize: 14,
        color: '#718096',
        marginTop: 12,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statPurple: {
        borderLeftWidth: 4,
        borderLeftColor: '#6C5CE7',
    },
    statGreen: {
        borderLeftWidth: 4,
        borderLeftColor: '#2ED573',
    },
    statOrange: {
        borderLeftWidth: 4,
        borderLeftColor: '#FFA502',
    },
    statBlue: {
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2D3748',
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
    },
    hoursContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
    },
    hoursStat: {
        alignItems: 'center',
    },
    hoursNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2D3748',
    },
    hoursLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
    },
    hoursDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E2E8F0',
    },
    hoursProgressContainer: {
        marginTop: 8,
    },
    hoursProgressText: {
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
        marginTop: 8,
    },
    actionsContainer: {
        marginBottom: 16,
    },
    actionButton: {
        marginBottom: 12,
    },
    tipsCard: {
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#6C5CE7',
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 12,
    },
    tipText: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 24,
    },
});

export default ProgressScreen;
