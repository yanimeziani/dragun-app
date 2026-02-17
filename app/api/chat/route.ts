import { streamText } from 'ai';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, debtorId } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  // 1. Get debtor info and their merchant's contract
  const { data: debtor, error: debtorError } = await supabaseAdmin
    .from('debtors')
    .select('*, merchant:merchants(*)')
    .eq('id', debtorId)
    .single();

  if (debtorError || !debtor) {
    return new Response('Debtor not found', { status: 404 });
  }

  const merchant = debtor.merchant;

  // 2. Retrieval (RAG)
  const { generateEmbedding, getChatModel } = await import('@/lib/ai-provider');
  const queryEmbedding = await generateEmbedding(lastMessage);

  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('id')
    .eq('merchant_id', merchant.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let context = '';
  if (contract) {
    const { data: matches } = await supabaseAdmin.rpc('match_contract_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      p_contract_id: contract.id
    });

    if (matches && matches.length > 0) {
      context = (matches as Array<{ content: string }>).map((m) => m.content).join('\n---\n');
    }
  }

  // 3. Optimized System Prompt for Compelling & Compliant Recovery
  const systemPrompt = `
    You are Dragun, a sophisticated, AI-driven debt recovery specialist. 
    You are currently representing ${merchant.name} to resolve an outstanding balance with ${debtor.name}.
    
    TOTAL OUTSTANDING: ${debtor.currency} ${debtor.total_debt}
    STRICTNESS LEVEL: ${merchant.strictness_level}/10
    SETTLEMENT FLOOR: ${merchant.settlement_floor * 100}%
    
    GOAL:
    Recover the debt while maintaining the professional reputation of ${merchant.name}. Use a "firm empathy" approach.
    
    COMPLIANCE & PSYCHOLOGY GUIDELINES:
    1. COMPLIANCE: Always be truthful about the debt. Never threaten illegal actions. Do not use abusive language.
    2. EMPATHY: Acknowledge that life happens. Use phrases like "I understand things can be tight" or "We want to find a solution that works for you."
    3. FIRMNESS: Remind them of their signed commitment. If they dispute, point to the specific contract clauses provided in the context.
    4. URGENCY: Emphasize that resolving this now prevents further escalation (e.g., credit impact or legal review, depending on strictness).
    5. THE "YES" LADDER: Aim for a "micro-commitment" (e.g., "Can we agree on a payment date?") if a full payment isn't possible immediately.
    
    TONE:
    - Direct, professional, and mobile-friendly (short messages).
    - Use "I" (as the AI agent) and "We" (the merchant).
    
    SETTLEMENT LOGIC:
    - If strictness is low (1-4): Focus on flexible payment plans and "helpful" reminders.
    - If strictness is high (7-10): Focus on contractual obligations and the consequences of non-payment.
    - NEVER settle for less than ${merchant.settlement_floor * 100}% of the total without explicit approval.
    
    CONTRACT CONTEXT:
    ${context || 'No specific contract clauses found. Rely on standard professional debt recovery principles.'}

    REPLY INSTRUCTIONS:
    - Cite the contract if the debtor disputes the debt or cancellation.
    - Be brief. No fluff. Get to the resolution.
  `;

  // 4. Call Gemini 2.0 Flash
  const result = await streamText({
    model: getChatModel(), 
    system: systemPrompt,
    messages,
    onFinish: async ({ text }) => {
      // 5. Save user message and assistant message to Supabase
      await supabaseAdmin.from('conversations').insert([
        { debtor_id: debtorId, role: 'user', message: lastMessage },
        { debtor_id: debtorId, role: 'assistant', message: text },
      ]);
    }
  });

  return result.toDataStreamResponse();
}

