import { mongoDbConnect } from "@/lib/mongodb/client";
import { User, type IUser } from "@/lib/mongodb/models/user";

class UserRepository {
  private async connect(): Promise<void> {
    await mongoDbConnect();
  }

  public async createUser(args: {
    clerkId: string;
    username: string;
    email: string;
  }): Promise<IUser> {
    await this.connect();

    try {
      const user = await User.create({
        clerkId: args.clerkId,
        username: args.username,
        email: args.email,
      });
      return user.toObject();
    } catch (error) {
      throw new Error(`Create user error: ${error}`);
    }
  }

  public async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    await this.connect();

    try {
      const user = await User.findOne({ clerkId }).lean();
      return user;
    } catch (error) {
      throw new Error(`Get user error: ${error}`);
    }
  }
}

export const userRepository = new UserRepository();
