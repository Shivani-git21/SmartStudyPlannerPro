/**
 * AddTaskScreen.js - Add New Study Task Screen
 * 
 * Form screen for creating new study tasks with validation.
 * Includes inputs for subject, topic, time, deadline, and priority.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
    StatusBar
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import { addTask } from '../utils/storage';
import { generateId, formatDate } from '../utils/helpers';

/**
 * Add Task Screen Component
 * @param {object} navigation - React Navigation prop for screen navigation
 */
const AddTaskScreen = ({ navigation }) => {
    // Form state
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [studyTime, setStudyTime] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [priority, setPriority] = useState('Medium');

    // UI state
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Error state
    const [errors, setErrors] = useState({});

    // Priority options
    const priorityOptions = ['Low', 'Medium', 'High'];

    /**
     * Validate all form inputs
     * @returns {boolean} - True if all validations pass
     */
    const validateForm = () => {
        const newErrors = {};

        // Subject validation
        if (!subject.trim()) {
            newErrors.subject = 'Subject name is required';
        }

        // Topic validation
        if (!topic.trim()) {
            newErrors.topic = 'Topic name is required';
        }

        // Study time validation
        if (!studyTime.trim()) {
            newErrors.studyTime = 'Study time is required';
        } else if (isNaN(studyTime) || parseFloat(studyTime) <= 0) {
            newErrors.studyTime = 'Please enter a valid positive number';
        }

        // Deadline validation (must be today or future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadline < today) {
            newErrors.deadline = 'Deadline must be today or a future date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle date picker change
     */
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDeadline(selectedDate);
            setErrors({ ...errors, deadline: '' });
        }
    };

    /**
     * Handle form submission
     * Validates inputs and saves task to storage
     */
    const handleSubmit = async () => {
        // Validate form before saving
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Create new task object
            const newTask = {
                id: generateId(),
                subject: subject.trim(),
                topic: topic.trim(),
                studyTime: parseFloat(studyTime),
                deadline: deadline.toISOString(),
                priority,
                completed: false,
                createdAt: new Date().toISOString(),
            };

            // Save task to AsyncStorage
            const success = await addTask(newTask);

            if (success) {
                Alert.alert(
                    'Success! 🎉',
                    'Your study task has been added successfully.',
                    [
                        {
                            text: 'Add Another',
                            onPress: () => {
                                // Reset form for new entry
                                setSubject('');
                                setTopic('');
                                setStudyTime('');
                                setDeadline(new Date());
                                setPriority('Medium');
                            },
                        },
                        {
                            text: 'View Tasks',
                            onPress: () => navigation.navigate('TaskList'),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to save task. Please try again.');
            }
        } catch (error) {
            console.error('Error saving task:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Add Study Task 📝</Text>
                    <Text style={styles.subtitle}>
                        Create a new task to track your study progress
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Subject Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Subject Name *</Text>
                        <TextInput
                            style={[styles.input, errors.subject && styles.inputError]}
                            placeholder="e.g., Mathematics, Physics"
                            placeholderTextColor="#A0AEC0"
                            value={subject}
                            onChangeText={(text) => {
                                setSubject(text);
                                setErrors({ ...errors, subject: '' });
                            }}
                        />
                        {errors.subject && (
                            <Text style={styles.errorText}>{errors.subject}</Text>
                        )}
                    </View>

                    {/* Topic Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Topic Name *</Text>
                        <TextInput
                            style={[styles.input, errors.topic && styles.inputError]}
                            placeholder="e.g., Calculus, Thermodynamics"
                            placeholderTextColor="#A0AEC0"
                            value={topic}
                            onChangeText={(text) => {
                                setTopic(text);
                                setErrors({ ...errors, topic: '' });
                            }}
                            multiline={true}
                        />
                        {errors.topic && (
                            <Text style={styles.errorText}>{errors.topic}</Text>
                        )}
                    </View>

                    {/* Study Time Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Study Time (hours) *</Text>
                        <TextInput
                            style={[styles.input, errors.studyTime && styles.inputError]}
                            placeholder="e.g., 2"
                            placeholderTextColor="#A0AEC0"
                            value={studyTime}
                            onChangeText={(text) => {
                                setStudyTime(text);
                                setErrors({ ...errors, studyTime: '' });
                            }}
                            keyboardType="decimal-pad"
                        />
                        {errors.studyTime && (
                            <Text style={styles.errorText}>{errors.studyTime}</Text>
                        )}
                    </View>

                    {/* Deadline Date Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Deadline *</Text>
                        <TouchableOpacity
                            style={[styles.dateButton, errors.deadline && styles.inputError]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateButtonText}>
                                📅 {formatDate(deadline)}
                            </Text>
                        </TouchableOpacity>
                        {errors.deadline && (
                            <Text style={styles.errorText}>{errors.deadline}</Text>
                        )}

                        {/* Date Picker Modal */}
                        {showDatePicker && (
                            <DateTimePicker
                                value={deadline}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Priority Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Priority Level *</Text>
                        <View style={styles.priorityContainer}>
                            {priorityOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.priorityButton,
                                        priority === option && styles.priorityButtonActive,
                                        priority === option && {
                                            backgroundColor:
                                                option === 'High' ? '#FF4757' :
                                                    option === 'Medium' ? '#FFA502' : '#2ED573'
                                        }
                                    ]}
                                    onPress={() => setPriority(option)}
                                >
                                    <Text style={[
                                        styles.priorityButtonText,
                                        priority === option && styles.priorityButtonTextActive
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <Button
                        title="Save Task"
                        onPress={handleSubmit}
                        loading={isLoading}
                        style={styles.submitButton}
                    />

                    {/* Cancel Button */}
                    <Button
                        title="Cancel"
                        onPress={() => navigation.goBack()}
                        variant="outline"
                        style={styles.cancelButton}
                    />
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
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
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
    form: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#2D3748',
    },
    inputError: {
        borderColor: '#FF4757',
        borderWidth: 2,
    },
    errorText: {
        color: '#FF4757',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    dateButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#2D3748',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    priorityButtonActive: {
        borderColor: 'transparent',
    },
    priorityButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
    },
    priorityButtonTextActive: {
        color: '#FFFFFF',
    },
    submitButton: {
        marginTop: 24,
    },
    cancelButton: {
        marginTop: 12,
    },
});

export default AddTaskScreen;
