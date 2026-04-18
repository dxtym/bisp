import { Pinecone } from "@pinecone-database/pinecone";

class PineconeClient {
  private readonly _client: Pinecone;
  private readonly _indexName: string;

  constructor() {
    this._client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    this._indexName = process.env.PINECONE_INDEX ?? "schema-index";
  }

  get client(): Pinecone {
    return this._client;
  }

  get indexName(): string {
    return this._indexName;
  }
}

const pineconeClient = new PineconeClient();
export default pineconeClient;
