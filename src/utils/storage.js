/**
 * storage.js - AsyncStorage Utility Functions
 * 
 * This module provides helper functions to safely interact with AsyncStorage
 * for persisting study tasks data locally on the device.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Key used to store tasks in AsyncStorage
const TASKS_STORAGE_KEY = '@smart_study_planner_tasks';

/**
 * Save tasks array to AsyncStorage
 * @param {Array} tasks - Array of task objects to save
 * @returns {Promise<boolean>} - Returns true if save was successful
 */
export const saveTasks = async (tasks) => {
  try {
    // Convert tasks array to JSON string before storing
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

/**
 * Retrieve all tasks from AsyncStorage
 * @returns {Promise<Array>} - Returns array of tasks or empty array if none exist
 */
export const getTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    // Parse JSON string back to array, return empty array if null
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

/**
 * Update a specific task by its ID
 * @param {string} taskId - The ID of the task to update
 * @param {Object} updates - Object containing the fields to update
 * @returns {Promise<boolean>} - Returns true if update was successful
 */
export const updateTask = async (taskId, updates) => {
  try {
    // Get current tasks
    const tasks = await getTasks();
    
    // Find and update the specific task
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates };
      }
      return task;
    });
    
    // Save updated tasks back to storage
    return await saveTasks(updatedTasks);
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

/**
 * Add a new task to storage
 * @param {Object} newTask - The new task object to add
 * @returns {Promise<boolean>} - Returns true if add was successful
 */
export const addTask = async (newTask) => {
  try {
    // Get current tasks
    const tasks = await getTasks();
    
    // Add new task to the array
    const updatedTasks = [...tasks, newTask];
    
    // Save updated tasks
    return await saveTasks(updatedTasks);
  } catch (error) {
    console.error('Error adding task:', error);
    return false;
  }
};

/**
 * Delete a task by its ID
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<boolean>} - Returns true if delete was successful
 */
export const deleteTask = async (taskId) => {
  try {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    return await saveTasks(filteredTasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

/**
 * Clear all tasks from storage
 * @returns {Promise<boolean>} - Returns true if clear was successful
 */
export const clearAllTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing tasks:', error);
    return false;
  }
};
