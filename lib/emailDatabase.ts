import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = await MongoClient.connect(uri);
  cachedClient = client;
  return client;
}

export async function saveEmailToDatabase(email: string, source: 'popup' | 'contact'): Promise<boolean> {
  try {
    const client = await connectToDatabase();
    const db = client.db('portfolio');
    const collection = db.collection('subscribers');

    // Check for duplicate
    const existing = await collection.findOne({ email: email.toLowerCase() });
    
    if (existing) {
      console.log(`Email already exists: ${email}`);
      return false;
    }

    // Insert new subscriber
    await collection.insertOne({
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
      source,
      createdAt: new Date(),
    });

    console.log(`✅ Email saved to database: ${email}`);
    return true;
  } catch (error) {
    console.error('Error saving email to database:', error);
    throw error;
  }
}

export async function getAllEmailsFromDatabase() {
  try {
    const client = await connectToDatabase();
    const db = client.db('portfolio');
    const collection = db.collection('subscribers');

    const subscribers = await collection.find({}).toArray();
    
    return subscribers.map(sub => ({
      email: sub.email,
      timestamp: sub.timestamp,
      source: sub.source,
    }));
  } catch (error) {
    console.error('Error getting emails from database:', error);
    return [];
  }
}
