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

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const handleSave = () => {
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

      {/* Display selected date in the middle */}
      <Text style={styles.selectedDateText}>{date.toLocaleDateString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
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
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  dateButton: {
    backgroundColor: '#4EBEB3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 100,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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

