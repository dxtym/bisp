import { createOpenAI } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import type { Schema } from "@/lib/repository/common";
import pineconeClient from "@/lib/agents/pinecone/client";

const SIMILARITY_THRESHOLD = 0.15;

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const embeddingModel = openai.embedding("text-embedding-3-small");

function schemaToTexts(schema: Schema[]): Array<{ id: string; text: string }> {
  return schema.map((t) => ({
    id: t.table,
    text: `${t.table}: ${t.columns.map((c) => `${c.name} ${c.type}`).join(", ")}`,
  }));
}

export async function index(schema: Schema[], namespace: string): Promise<void> {
  if (schema.length === 0) return;

  const entries = schemaToTexts(schema).filter((e) => e.id && e.text);
  if (entries.length === 0) return;

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: entries.map((e) => e.text),
  });

  const vectors = entries
    .map((entry, i) => ({
      id: entry.id,
      values: embeddings[i],
      metadata: { text: entry.text },
    }))
    .filter((v) => v.values?.length > 0);
  if (vectors.length === 0) return;

  const index = pineconeClient.client
    .index(pineconeClient.indexName)
    .namespace(namespace);

  await index.upsert({ records: vectors });
}

export async function validate(query: string, namespace: string): Promise<boolean> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  const index = pineconeClient.client
    .index(pineconeClient.indexName)
    .namespace(namespace);

  const result = await index.query({
    topK: 1,
    vector: embedding,
    includeMetadata: false,
  });

  const topScore = result.matches?.[0]?.score ?? 0;
  return topScore >= SIMILARITY_THRESHOLD;
}
