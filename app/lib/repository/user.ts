import { mongoDbConnect } from "@/lib/mongodb/client";
import { User, type IUser } from "@/lib/mongodb/models/user";
import { BaseRepository } from "@/lib/repository/base";

class UserRepository extends BaseRepository {
  protected async connect(): Promise<void> {
    await mongoDbConnect();
  }

  public async createUser(args: { name: string; email: string; image?: string }): Promise<IUser> {
    return this.run("Create user error", () =>
      User.create({ id: crypto.randomUUID(), ...args }).then((u) => u.toObject())
    );
  }

  public async createUserWithCredentials(args: { name: string; email: string; passwordHash: string }): Promise<IUser> {
    return this.run("Create user error", () =>
      User.create({ id: crypto.randomUUID(), ...args }).then((u) => u.toObject())
    );
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return this.run("Get user error", () =>
      User.findOne({ email }).lean() as Promise<IUser | null>
    );
  }

  public async getQueriesCount(id: string): Promise<number | null> {
    return this.run("Get queries count error", async () => {
      const user = await User.findOne({ id }, { queriesCount: 1 }).lean();
      return user ? (user.queriesCount ?? 0) : null;
    });
  }

  public async updatePlan(id: string, plan: "pro" | "max" | "team"): Promise<void> {
    const queriesCount: Record<"pro" | "max" | "team", number> = { pro: 50, max: 1000, team: 10000 };
    return this.run("Update plan error", () =>
      User.updateOne({ id }, { plan, queriesCount: queriesCount[plan] }).then(() => undefined)
    );
  }

  public async checkAndDecrementQueryCount(id: string): Promise<boolean> {
    return this.run("Decrement query count error", async () => {
      const result = await User.updateOne(
        { id, queriesCount: { $gt: 0 } },
        { $inc: { queriesCount: -1 } }
      );
      return result.modifiedCount > 0;
    });
  }
}

export const userRepository = new UserRepository();
