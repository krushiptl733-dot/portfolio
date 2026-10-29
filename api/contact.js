// Vercel serverless function: POST /api/contact  ->  saves the message in MongoDB (collection "messages").
import { MongoClient } from 'mongodb';

let client;
async function getDb() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  client ??= new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db(process.env.MONGODB_DB || 'portfolio');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const { name = '', email = '', message = '', website = '' } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // honeypot: bots fill this hidden field
  const bad = name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email.trim()) || message.trim().length < 5 || message.length > 2000;
  if (bad) return res.status(400).json({ ok: false, error: 'Please fill all fields correctly.' });
  try {
    const db = await getDb();
    await db.collection('messages').insertOne({
      name: name.trim().slice(0, 100), email: email.trim().slice(0, 200), message: message.trim(), createdAt: new Date(),
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Could not save the message.' });
  }
}
