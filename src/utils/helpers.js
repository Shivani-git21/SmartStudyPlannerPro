/**
 * helpers.js - Helper/Utility Functions
 * 
 * This module contains utility functions used throughout the app
 * for calculations, formatting, and validation.
 */

/**
 * Calculate the completion percentage of tasks
 * @param {Array} tasks - Array of task objects
 * @returns {number} - Percentage of completed tasks (0-100)
 */
export const calculateProgress = (tasks) => {
    // Return 0 if no tasks exist
    if (!tasks || tasks.length === 0) {
        return 0;
    }

    // Count completed tasks
    const completedTasks = tasks.filter(task => task.completed).length;

    // Calculate and return percentage (rounded to nearest integer)
    return Math.round((completedTasks / tasks.length) * 100);
};

/**
 * Format a date object to a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string (e.g., "Jan 15, 2026")
 */
export const formatDate = (date) => {
    // Handle both Date objects and date strings
    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    // Format options for readable date
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Generate a unique ID for tasks
 * @returns {string} - Unique identifier string
 */
export const generateId = () => {
    // Generate ID using timestamp and random number
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email format is valid
 */
export const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Get priority color based on priority level
 * @param {string} priority - Priority level (Low, Medium, High)
 * @returns {string} - Color code for the priority
 */
export const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
        case 'high':
            return '#FF4757'; // Red
        case 'medium':
            return '#FFA502'; // Orange
        case 'low':
            return '#2ED573'; // Green
        default:
            return '#747D8C'; // Gray
    }
};

/**
 * Get greeting based on current time
 * @returns {string} - Appropriate greeting message
 */
export const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good Morning';
    } else if (hour < 17) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
};

/**
 * Filter tasks by today's deadline
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Tasks with today's deadline
 */
export const getTodaysTasks = (tasks) => {
    if (!tasks || tasks.length === 0) {
        return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        return deadline.getTime() === today.getTime();
    });
};

/**
 * Sort tasks by priority (High > Medium > Low)
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Sorted tasks array
 */
export const sortByPriority = (tasks) => {
    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };

    return [...tasks].sort((a, b) => {
        const priorityA = priorityOrder[a.priority?.toLowerCase()] || 4;
        const priorityB = priorityOrder[b.priority?.toLowerCase()] || 4;
        return priorityA - priorityB;
    });
};
