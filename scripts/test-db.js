import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // charge .env.local

async function testConnection() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI est vide ou invalide');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion réussie à MongoDB');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Connexion échouée :', err.message);
  }
}

testConnection();
