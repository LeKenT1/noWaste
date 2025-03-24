// src/database/realmConfig.js
import Realm from 'realm';

// Schéma pour un aliment
export const AlimentSchema = {
  name: 'Aliment',
  primaryKey: 'id',
  properties: {
    id: 'string',             // Identifiant unique
    nom: 'string',            // Nom de l'aliment
    datePeremption: 'date',   // Date de péremption
  },
};

// Configuration Realm
const realmConfig = {
  schema: [AlimentSchema],
  schemaVersion: 1,
  // Pour le prototypage, on peut utiliser deleteRealmIfMigrationNeeded
  deleteRealmIfMigrationNeeded: true,
};

export default realmConfig;
