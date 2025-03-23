import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'; // Import trash icon

const initialItems = [
  { id: '1', name: 'Cuisse de poulet', expiryDate: new Date(2023, 2, 28) },
  { id: '2', name: 'Jus de fruit', expiryDate: new Date(2023, 2, 30) },
  { id: '3', name: 'Yaourt', expiryDate: new Date(2023, 3, 2) },
  { id: '4', name: 'Cuisse de poulet', expiryDate: new Date(2023, 3, 6) },
  { id: '5', name: 'Jus de fruit', expiryDate: new Date(2023, 3, 8) },
  { id: '6', name: 'Yaourt', expiryDate: new Date(2023, 3, 11) },
];

export default function ListScreen() {
  const params = useLocalSearchParams();
  const [items, setItems] = useState(initialItems);
  const today = new Date();

  useEffect(() => {
    if (params.newItemName && params.newItemDate) {
      const name = params.newItemName.toString();
      const expiryDate = new Date(params.newItemDate.toString());
      const newId = (items.length + 1).toString();

      setItems(prevItems => [...prevItems, { id: newId, name, expiryDate }]);
    }
  }, [params.newItemName, params.newItemDate]);

  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const isPastDate = (date) => {
    return date < today;
  };

  const handleDelete = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={styles.bulletPoint} />
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.dateLine} />
      <Text style={[styles.itemDate, isPastDate(item.expiryDate) ? styles.pastDate : styles.futureDate]}>
        {formatDate(item.expiryDate)}
      </Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <AntDesign name="delete" size={18} color="red" />
      </TouchableOpacity>
    </View>
  );

  const pastItems = items.filter(item => isPastDate(item.expiryDate));
  const futureItems = items.filter(item => !isPastDate(item.expiryDate));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Date passée :</Text>
        <FlatList
          data={pastItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Date à venir :</Text>
        <FlatList
          data={futureItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  listSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#4EBEB3',
    textAlign: 'center',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#4EBEB3',
    marginVertical: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'black',
    marginRight: 10,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
  },
  dateLine: {
    height: 1,
    backgroundColor: '#ccc',
    flex: 1,
    marginHorizontal: 10,
  },
  itemDate: {
    fontSize: 14,
    width: 50,
    textAlign: 'right',
  },
  pastDate: {
    color: '#4EBEB3',
  },
  futureDate: {
    color: '#4EBEB3',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  menuButton: {
    backgroundColor: '#4EBEB3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 40,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
  },
});