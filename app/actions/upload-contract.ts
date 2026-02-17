'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateEmbedding } from '@/lib/ai-provider';
import { chunkText } from '@/lib/chunking';
import { PDFParse } from 'pdf-parse';

export async function uploadContract(merchantId: string, formData: FormData) {
  const file = formData.get('contract') as File;
  if (!file) throw new Error('No file provided');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // 1. Parse PDF
  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  const rawText = data.text;

  // 2. Save to Supabase Storage (optional, but good for reference)
  const filePath = `merchants/${merchantId}/${file.name}`;
  const { error: storageError } = await supabaseAdmin.storage
    .from('contracts')
    .upload(filePath, buffer, { contentType: 'application/pdf', upsert: true });

  if (storageError) throw new Error(`Storage error: ${storageError.message}`);

  // 3. Save to contracts table
  const { data: contract, error: contractError } = await supabaseAdmin
    .from('contracts')
    .insert({
      merchant_id: merchantId,
      file_name: file.name,
      file_path: filePath,
      raw_text: rawText,
    })
    .select()
    .single();

  if (contractError) throw new Error(`Contract table error: ${contractError.message}`);

  // 4. Chunk and Embed
  const chunks = chunkText(rawText);
  const embeddingPromises = chunks.map(async (chunk) => {
    const embedding = await generateEmbedding(chunk);
    return {
      contract_id: contract.id,
      content: chunk,
      embedding: embedding,
    };
  });

  const embeddings = await Promise.all(embeddingPromises);

  // 5. Save to contract_embeddings table
  const { error: embeddingsError } = await supabaseAdmin
    .from('contract_embeddings')
    .insert(embeddings);

  if (embeddingsError) throw new Error(`Embeddings error: ${embeddingsError.message}`);

  return { success: true, contractId: contract.id };
}
