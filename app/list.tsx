import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Realm from 'realm';
import realmConfig from '../database/realmConfig';
import { Aliment } from '@/models/aliment';

export default function ListScreen() {
  const [items, setItems] = useState<Aliment[]>([]);
  const [realmInstance, setRealmInstance] = useState<Realm | null>(null);
  const today = new Date();

  useEffect(() => {
    let realm: Realm | null = null;

    const initRealm = async () => {
      try {
        const r = await Realm.open(realmConfig);
        realm = r;
        setRealmInstance(r);

        const aliments = r.objects<Aliment>('Aliment');
        
        const updateItems = () => {
          setItems([...aliments]);
        };

        updateItems();

        r.addListener('change', updateItems);

        return () => {
          if (realm && !realm.isClosed) {
            realm.removeAllListeners();
            realm.close();
          }
        };
      } catch (error) {
        console.error('Error initializing Realm:', error);
      }
    };

    initRealm();

    return () => {
      if (realmInstance && !realmInstance.isClosed) {
        realmInstance.removeAllListeners();
        realmInstance.close();
      }
    };
  }, []);

  const formatDate = (date: Date): string =>
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

  const isPastDate = (date: Date): boolean => date < today;

  const handleDelete = (id: string) => {
    if (realmInstance) {
      realmInstance.write(() => {
        const toDelete = realmInstance.objectForPrimaryKey<Aliment>('Aliment', id);
        if (toDelete) {
          realmInstance.delete(toDelete);
        }
      });
    }
  };

  const renderItem = ({ item }: { item: Aliment }) => (
    <View style={styles.itemRow}>
      <View style={styles.bulletPoint} />
      <Text style={styles.itemName}>{item.nom}</Text>
      <View style={styles.dateLine} />
      <Text
        style={[
          styles.itemDate,
          isPastDate(item.datePeremption) ? styles.pastDate : styles.futureDate,
        ]}
      >
        {formatDate(item.datePeremption)}
      </Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={{ color: 'red' }}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const pastItems = items.filter(item => isPastDate(item.datePeremption));
  const futureItems = items.filter(item => !isPastDate(item.datePeremption));

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