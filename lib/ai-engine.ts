import { supabaseAdmin } from './supabase-admin';
import { generateEmbedding, getChatModel } from './ai-provider';
import { streamText } from 'ai';

export async function getDebtorChatResponse(debtorId: string, message: string) {
  // 1. Get debtor info and their merchant's contract
  const { data: debtor, error: debtorError } = await supabaseAdmin
    .from('debtors')
    .select('*, merchant:merchants(*)')
    .eq('id', debtorId)
    .single();

  if (debtorError || !debtor) throw new Error('Debtor not found');

  const merchant = debtor.merchant;
  
  // 2. Get the contract for this merchant
  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('id')
    .eq('merchant_id', merchant.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let context = '';
  if (contract) {
    // 3. Generate query embedding for retrieval
    const queryEmbedding = await generateEmbedding(message);

    // 4. Retrieve context from pgvector
    const { data: matches } = await supabaseAdmin.rpc('match_contract_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5, // Adjust as needed
      match_count: 5,
      p_contract_id: contract.id
    });

    if (matches && (matches as Array<{ content: string }>).length > 0) {
      context = (matches as Array<{ content: string }>).map((m) => m.content).join('\n---\n');
    }
  }

  // 5. Build system prompt
  const systemPrompt = `
    You are Dragun.app, an automated debt recovery agent powered by Gemini 2.0 Flash.
    Your tone is empathetic but firm.
    Merchant: ${merchant.name}
    Debtor: ${debtor.name}
    Total Debt: ${debtor.currency} ${debtor.total_debt}
    Merchant Strictness: ${merchant.strictness_level}/10 (1 is soft, 10 is firm legal notices).
    Merchant Settlement Floor: ${merchant.settlement_floor * 100}% of the total debt.

    INSTRUCTIONS:
    - You must cite the contract context if provided.
    - If the debtor makes an excuse, check the contract.
    - Offer settlement plans within the settlement floor if they seem unable to pay.
    - Keep it WhatsApp-style (short paragraphs).
    
    CONTRACT CONTEXT:
    ${context || 'No specific contract context found. Use general empathetic but firm principles.'}
  `;

  // 6. Return stream
  return streamText({
    model: getChatModel(), 
    system: systemPrompt,
    prompt: message,
    // Add history here if needed
  });
}
