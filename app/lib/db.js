//app/lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('❌ MONGODB_URI not defined in .env');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'taxes-de-sejour',
      bufferCommands: false,
    })
    .then((mongoose) => {
      console.log('[MongoDB] ✅ Connecté avec succès');
      return mongoose;
    })
    .catch((err) => {
      console.error('[MongoDB] ❌ Échec de connexion :', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
