import { mongoDbConnect } from "@/lib/mongodb/client";
import { User, type IUser } from "@/lib/mongodb/models/user";

class UserRepository {
  private async connect(): Promise<void> {
    await mongoDbConnect();
  }

  public async createUser(args: {
    name: string;
    email: string;
    image?: string;
  }): Promise<IUser> {
    await this.connect();

    try {
      const user = await User.create({
        id: crypto.randomUUID(),
        name: args.name,
        email: args.email,
        image: args.image,
      });
      return user.toObject();
    } catch (error) {
      throw new Error(`Create user error: ${error}`);
    }
  }

  public async createUserWithCredentials(args: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<IUser> {
    await this.connect();

    try {
      const user = await User.create({
        id: crypto.randomUUID(),
        name: args.name,
        email: args.email,
        passwordHash: args.passwordHash,
      });
      return user.toObject();
    } catch (error) {
      throw new Error(`Create user error: ${error}`);
    }
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    await this.connect();

    try {
      const user = await User.findOne({ email }).lean();
      return user;
    } catch (error) {
      throw new Error(`Get user error: ${error}`);
    }
  }

  public async getQueriesCount(id: string): Promise<number | null> {
    await this.connect();

    try {
      const user = await User.findOne({ id }, { queriesCount: 1 }).lean();
      return user ? (user.queriesCount ?? 0) : null;
    } catch (error) {
      throw new Error(`Get queries count error: ${error}`);
    }
  }

  public async checkAndDecrementQueryCount(id: string): Promise<boolean> {
    await this.connect();

    try {
      const result = await User.updateOne(
        { id, queriesCount: { $gt: 0 } },
        { $inc: { queriesCount: -1 } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw new Error(`Decrement query count error: ${error}`);
    }
  }
}

export const userRepository = new UserRepository();
