import { google } from '@ai-sdk/google';
import { embed } from 'ai';

/**
 * Gemini 2.0 Flash for sub-second latency and 1M context.
 */
export const getChatModel = () => {
  return google('gemini-2.0-flash-001'); 
};

/**
 * Gemini Text-Embedding-004
 * Matches the 768-dimension vector column in Supabase.
 */
export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.embedding('text-embedding-004'),
    value: text,
  });
  return embedding;
}
