import { z } from "zod";
import mongoose, { Mongoose } from "mongoose";

const MongoDbConfig = z.object({
  user: z.string().optional(),
  pass: z.string().optional(),
  dbName: z.string().optional(),
});
type MongoDbConfig = z.infer<typeof MongoDbConfig>;

class MongoDbClient {
  private static instance: MongoDbClient | null = null;

  private constructor() { }

  public static getInstance(): MongoDbClient {
    if (!MongoDbClient.instance) {
      MongoDbClient.instance = new MongoDbClient();
    }
    return MongoDbClient.instance;
  }

  public async connect(config?: MongoDbConfig): Promise<Mongoose> {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI!,
        {
          user: config?.user || process.env.MONGODB_USER,
          pass: config?.pass || process.env.MONGODB_PASSWORD,
          dbName: config?.dbName || process.env.MONGODB_NAME,
        },
      );
      return mongoose;
    } catch (err) {
      throw new Error(`MongoDB error: ${err}`);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (err) {
      throw new Error(`MongoDB error: ${err}`);
    }
  }
}

export const mongoDbClient = MongoDbClient.getInstance();
export const mongoDbConnect = (config?: MongoDbConfig) => mongoDbClient.connect(config);
export const mongoDbDisconnect = () => mongoDbClient.disconnect();
