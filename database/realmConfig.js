import Realm from 'realm';

export const AlimentSchema = {
  name: 'Aliment',
  primaryKey: 'id',
  properties: {
    id: 'string',             
    nom: 'string',            
    datePeremption: 'date',   
  },
};

const realmConfig = {
  schema: [AlimentSchema],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
};

export default realmConfig;
