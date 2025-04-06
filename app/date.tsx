import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Realm from 'realm';
import realmConfig from '../database/realmConfig';
import uuid from 'react-native-uuid';
import { scheduleNotification } from '../services/notifications';

type RootStackParamList = {
  Date: { foodName: string };
  List: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Date'>;
type DateRouteProp = RouteProp<RootStackParamList, 'Date'>;

export default function DateScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DateRouteProp>();
  const foodName = route.params.foodName;
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      const realm = await Realm.open(realmConfig);
      realm.write(() => {
        realm.create('Aliment', {
          id: uuid.v4().toString(),
          nom: foodName,
          datePeremption: date,
        });
      });
      realm.close();

      await scheduleNotification(
        'Aliment à consommer',
        `Votre ${foodName} arrive à expiration aujourd'hui!`,
        date
      );

      navigation.navigate('List');
    } catch (error) {
      console.error('Erreur lors de l\'insertion dans Realm', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.foodnameText}>
        {foodName}
      </Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>Sélectionner une date</Text>
      </TouchableOpacity>

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
    paddingTop: 20,
  },
  dateButton: {
    backgroundColor: '#4EBEB3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 50,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  foodnameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 250,
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
