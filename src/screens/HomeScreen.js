/**
 * HomeScreen.js - Main Dashboard Screen
 * 
 * Displays welcome message, today's progress, and navigation
 * to other sections of the app.
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { getTasks } from '../utils/storage';
import { getGreeting, calculateProgress } from '../utils/helpers';

/**
 * Home Screen Component
 * @param {object} navigation - React Navigation prop for screen navigation
 */
const HomeScreen = ({ navigation }) => {
    // State for tasks and progress
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Load tasks from storage and calculate progress
     */
    const loadTasks = async () => {
        try {
            const storedTasks = await getTasks();
            setTasks(storedTasks);
            setProgress(calculateProgress(storedTasks));
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    // Reload tasks every time screen comes into focus
    // This ensures progress is up-to-date after adding/completing tasks
    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    /**
     * Handle pull-to-refresh
     */
    const onRefresh = async () => {
        setRefreshing(true);
        await loadTasks();
        setRefreshing(false);
    };

    // Get appropriate greeting based on time of day
    const greeting = getGreeting();

    // Count pending and completed tasks
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.greeting}>{greeting}! 🎓</Text>
                <Text style={styles.welcomeMessage}>Ready to study today?</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressTitle}>Your Progress</Text>
                    <ProgressBar progress={progress} height={16} />
                    <Text style={styles.progressSubtext}>
                        {completedTasks} of {tasks.length} tasks completed
                    </Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, styles.pendingCard]}>
                        <Text style={styles.statNumber}>{pendingTasks}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={[styles.statCard, styles.completedCard]}>
                        <Text style={styles.statNumber}>{completedTasks}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={[styles.statCard, styles.totalCard]}>
                        <Text style={styles.statNumber}>{tasks.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <Button
                        title="➕ Add Study Task"
                        onPress={() => navigation.navigate('AddTask')}
                        style={styles.actionButton}
                    />

                    <Button
                        title="📋 View All Tasks"
                        onPress={() => navigation.navigate('TaskList')}
                        variant="secondary"
                        style={styles.actionButton}
                    />

                    <Button
                        title="📊 View Progress"
                        onPress={() => navigation.navigate('Progress')}
                        variant="outline"
                        style={styles.actionButton}
                    />
                </View>

                {/* Motivation Quote */}
                <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>
                        "The secret of getting ahead is getting started."
                    </Text>
                    <Text style={styles.quoteAuthor}>— Mark Twain</Text>
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
        backgroundColor: '#4A90E2',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    welcomeMessage: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: -20,
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
    },
    progressSubtext: {
        fontSize: 14,
        color: '#718096',
        marginTop: 12,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pendingCard: {
        borderTopWidth: 3,
        borderTopColor: '#FFA502',
    },
    completedCard: {
        borderTopWidth: 3,
        borderTopColor: '#2ED573',
    },
    totalCard: {
        borderTopWidth: 3,
        borderTopColor: '#4A90E2',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2D3748',
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
    },
    actionButton: {
        marginBottom: 12,
    },
    quoteCard: {
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#4A5568',
        lineHeight: 24,
    },
    quoteAuthor: {
        fontSize: 14,
        color: '#718096',
        marginTop: 8,
        textAlign: 'right',
    },
});

export default HomeScreen;
