/**
 * TaskListScreen.js - View All Tasks Screen
 * 
 * Displays all study tasks in a card layout with the ability
 * to mark tasks as completed and view task details.
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import { getTasks, updateTask } from '../utils/storage';
import { sortByPriority } from '../utils/helpers';

/**
 * Task List Screen Component
 * @param {object} navigation - React Navigation prop for screen navigation
 */
const TaskListScreen = ({ navigation }) => {
    // State for tasks
    const [tasks, setTasks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, completed

    /**
     * Load tasks from AsyncStorage
     */
    const loadTasks = async () => {
        try {
            const storedTasks = await getTasks();
            // Sort tasks by priority (High > Medium > Low)
            const sortedTasks = sortByPriority(storedTasks);
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    // Reload tasks every time screen comes into focus
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

    /**
     * Toggle task completion status
     * @param {string} taskId - ID of the task to toggle
     */
    const handleToggleComplete = async (taskId) => {
        try {
            // Find the task and toggle its completed status
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                const success = await updateTask(taskId, { completed: !task.completed });
                if (success) {
                    // Reload tasks to reflect changes
                    await loadTasks();
                }
            }
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    /**
     * Filter tasks based on selected filter
     * @returns {Array} - Filtered tasks array
     */
    const getFilteredTasks = () => {
        switch (filter) {
            case 'pending':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();

    /**
     * Render individual task card
     */
    const renderTaskCard = ({ item }) => (
        <TaskCard
            task={item}
            onToggleComplete={handleToggleComplete}
            onPress={() => {
                // Could navigate to task details screen if needed
                console.log('Task pressed:', item.id);
            }}
        />
    );

    /**
     * Render empty state when no tasks exist
     */
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>
                {filter === 'all'
                    ? 'No tasks yet!'
                    : filter === 'pending'
                        ? 'No pending tasks!'
                        : 'No completed tasks!'}
            </Text>
            <Text style={styles.emptySubtext}>
                {filter === 'all'
                    ? 'Start by adding your first study task'
                    : 'Try changing the filter to see other tasks'}
            </Text>
            {filter === 'all' && (
                <Button
                    title="Add Your First Task"
                    onPress={() => navigation.navigate('AddTask')}
                    style={styles.emptyButton}
                />
            )}
        </View>
    );

    // Count tasks for filter badges
    const pendingCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Your Tasks 📚</Text>
                <Text style={styles.subtitle}>
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
                </Text>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <View style={styles.filterTabs}>
                    <FilterTab
                        label="All"
                        count={tasks.length}
                        active={filter === 'all'}
                        onPress={() => setFilter('all')}
                    />
                    <FilterTab
                        label="Pending"
                        count={pendingCount}
                        active={filter === 'pending'}
                        onPress={() => setFilter('pending')}
                    />
                    <FilterTab
                        label="Done"
                        count={completedCount}
                        active={filter === 'completed'}
                        onPress={() => setFilter('completed')}
                    />
                </View>
            </View>

            {/* Task List */}
            <FlatList
                data={filteredTasks}
                renderItem={renderTaskCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

            {/* Floating Add Button */}
            {tasks.length > 0 && (
                <View style={styles.fabContainer}>
                    <Button
                        title="+ Add Task"
                        onPress={() => navigation.navigate('AddTask')}
                        style={styles.fabButton}
                    />
                </View>
            )}
        </View>
    );
};

/**
 * Filter Tab Component
 * Used for switching between All/Pending/Completed views
 */
const FilterTab = ({ label, count, active, onPress }) => (
    <View style={styles.filterTabWrapper}>
        <Text
            style={[
                styles.filterTab,
                active && styles.filterTabActive
            ]}
            onPress={onPress}
        >
            {label}
        </Text>
        <View style={[styles.filterBadge, active && styles.filterBadgeActive]}>
            <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextActive]}>
                {count}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2D3748',
    },
    subtitle: {
        fontSize: 14,
        color: '#718096',
        marginTop: 4,
    },
    filterContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    filterTabs: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: 12,
        padding: 4,
    },
    filterTabWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterTab: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
        borderRadius: 8,
    },
    filterTabActive: {
        color: '#4A90E2',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    filterBadge: {
        backgroundColor: '#CBD5E0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 4,
    },
    filterBadgeActive: {
        backgroundColor: '#4A90E2',
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#4A5568',
    },
    filterBadgeTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        paddingHorizontal: 32,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
    },
    fabButton: {
        shadowColor: '#4A90E2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
});

export default TaskListScreen;
