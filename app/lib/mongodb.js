import mongoose from 'mongoose';

let isConnected = false;

export async function connectDb() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'taxes-de-sejour', // adapte si besoin
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('[MongoDB] Connecté avec succès');
  } catch (error) {
    console.error('[MongoDB] Erreur de connexion :', error);
    throw error;
  }
}
