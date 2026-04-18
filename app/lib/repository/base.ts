export abstract class BaseRepository {
  protected abstract connect(): Promise<void>;

  protected async run<T>(label: string, fn: () => Promise<T>): Promise<T> {
    await this.connect();
    try {
      return await fn();
    } catch (error) {
      throw new Error(`${label}: ${error}`);
    }
  }
}
