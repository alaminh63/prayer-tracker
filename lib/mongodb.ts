import { MongoClient, type Db } from "mongodb"
import { env } from "@/lib/env"

const MONGODB_URI = env.MONGODB_URI
const MONGODB_DB = env.MONGODB_DB

let cached: { client: MongoClient | null; db: Db | null } = {
  client: null,
  db: null,
}

export function isMongoConfigured(): boolean {
  return !!MONGODB_URI
}

export async function connectToDatabase(): Promise<{
  client: MongoClient
  db: Db
}> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured")
  }

  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db }
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  })
  const db = client.db(MONGODB_DB)

  cached.client = client
  cached.db = db

  return { client, db }
}
