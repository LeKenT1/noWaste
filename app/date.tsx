import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const foodName = params.foodName?.toString() || '';
  
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const handleSave = () => {
    // In a real app, you would save this data to a database or storage
    router.push({
      pathname: '/list',
      params: { 
        newItemName: foodName,
        newItemDate: date.toISOString()
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>Sélectionner une date</Text>
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      <View style={styles.dateDisplay}>
        <View style={styles.calendarHeader}>
          <Text style={styles.monthYearText}>
            {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
          </Text>
          <Text style={styles.timeText}>
            {date.getHours().toString().padStart(2, '0')}:
            {date.getMinutes().toString().padStart(2, '0')}
          </Text>
        </View>
        
        <View style={styles.calendarGrid}>
          {/* Calendar grid would go here - simplified for this example */}
          <Text style={styles.selectedDateText}>
            {date.toLocaleDateString('default', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })} - {date.getHours().toString().padStart(2, '0')}:
            {date.getMinutes().toString().padStart(2, '0')}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.todayButton}
          onPress={() => setDate(new Date())}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <Link href="/food-name" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Retour</Text>
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  dateButton: {
    backgroundColor: '#4EBEB3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  dateDisplay: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
  calendarGrid: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
  },
  todayButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4EBEB3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  saveButton: {
    backgroundColor: '#4EBEB3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});