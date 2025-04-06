import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  FoodName: { scannedData?: string };
  Date: { foodName: string };
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type FoodNameRouteProp = RouteProp<RootStackParamList, 'FoodName'>;

const foodSuggestions = [
  'Poulet',
  'Lait',
  'Steack',
  'Jus de fruit',
  'Yaourt',
  'Fraise'
];

export default function FoodNameScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FoodNameRouteProp>();
  const [foodName, setFoodName] = useState(route.params?.scannedData || '');

  const handleChipPress = (food: string) => {
    setFoodName(food);
  };

  const handleNext = () => {
    if (foodName.trim()) {
      navigation.navigate('Date', { foodName });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Entrer le nom du produit</Text>
      
      <TextInput
        style={styles.input}
        value={foodName}
        onChangeText={setFoodName}
        placeholder="Nom du produit"
        placeholderTextColor="#aaa"
      />
      
      <View style={styles.chipsContainer}>
        <View style={styles.chipsRow}>
          {foodSuggestions.slice(0, 3).map((food, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleChipPress(food)}
            >
              <Text style={styles.chipText}>{food}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.chipsRow}>
          {foodSuggestions.slice(3).map((food, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleChipPress(food)}
            >
              <Text style={styles.chipText}>{food}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        {foodName.trim() && (
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Suivant</Text>
          </TouchableOpacity>
        )}
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
  title: {
    fontSize: 18,
    color: '#4EBEB3',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#4EBEB3',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 30,
  },
  chipsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#4EBEB3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  chipText: {
    color: 'white',
    fontSize: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
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
  nextButton: {
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});