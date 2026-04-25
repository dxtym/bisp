import { mongoDbConnect } from "@/lib/mongodb/client";
import { User, type IUser } from "@/lib/mongodb/models/user";
import { Conversation } from "@/lib/mongodb/models/conversation";
import { BaseRepository } from "@/lib/repository/base";
import { PLAN_LIMITS, type Plan } from "@/lib/constants/plans";

class UserRepository extends BaseRepository {
  protected async connect(): Promise<void> {
    await mongoDbConnect();
  }

  public async createUser(args: { name: string; email: string; image?: string; passwordHash?: string }): Promise<IUser> {
    return this.run("Create user error", () =>
      User.create({ id: crypto.randomUUID(), ...args }).then((u) => u.toObject())
    );
  }

  public async getUserByEmail(email: string): Promise<IUser | null> {
    return this.run("Get user error", () =>
      User.findOne({ email }).lean() as Promise<IUser | null>
    );
  }

  public async getQuotaInfo(id: string): Promise<{ queriesCount: number; plan: Plan; limit: number } | null> {
    return this.run("Get quota info error", async () => {
      const user = await User.findOne({ id }, { queriesCount: 1, plan: 1 }).lean();
      if (!user) return null;
      const plan = (user.plan ?? "free") as Plan;
      return {
        queriesCount: user.queriesCount ?? 0,
        plan,
        limit: PLAN_LIMITS[plan],
      };
    });
  }

  public async updatePlan(id: string, plan: Exclude<Plan, "free">): Promise<void> {
    return this.run("Update plan error", () =>
      User.updateOne({ id }, { plan, queriesCount: PLAN_LIMITS[plan] }).then(() => undefined)
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

  public async getAllUsers(): Promise<IUser[]> {
    return this.run("Get all users error", () =>
      User.find({}, { id: 1, name: 1, email: 1, image: 1, plan: 1, role: 1, disabled: 1, queriesCount: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .lean() as Promise<IUser[]>
    );
  }

  public async setDisabled(id: string, disabled: boolean): Promise<void> {
    return this.run("Set disabled error", () =>
      User.updateOne({ id }, { disabled }).then(() => undefined)
    );
  }

  public async getDailyMessageCounts(days: number): Promise<{ date: string; count: number }[]> {
    return this.run("Get daily message counts error", async () => {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const result = await Conversation.aggregate([
        { $unwind: "$messages" },
        { $match: { "messages.role": "user", "messages.createdAt": { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$messages.createdAt" } } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return result.map((r: { _id: string; count: number }) => ({ date: r._id, count: r.count }));
    });
  }

  public async getDailyActiveUsers(days: number): Promise<{ date: string; activeUsers: number }[]> {
    return this.run("Get daily active users error", async () => {
      const since = new Date();
      since.setDate(since.getDate() - days);
      const result = await Conversation.aggregate([
        { $unwind: "$messages" },
        { $match: { "messages.role": "user", "messages.createdAt": { $gte: since } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$messages.createdAt" } } },
              userId: "$userId",
            },
          },
        },
        {
          $group: {
            _id: "$_id.date",
            activeUsers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return result.map((r: { _id: string; activeUsers: number }) => ({ date: r._id, activeUsers: r.activeUsers }));
    });
  }
}

export const userRepository = new UserRepository();
