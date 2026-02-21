import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cardId: string }> }
) {
  const { id, cardId } = await params;

  // Fetch card with its history
  const [cardResult, historyResult] = await Promise.all([
    supabase
      .from("kanban_cards")
      .select("*")
      .eq("id", cardId)
      .eq("projeto_id", id)
      .single(),
    supabase
      .from("kanban_historico")
      .select("*")
      .eq("card_id", cardId)
      .order("data_mudanca", { ascending: true }),
  ]);

  if (cardResult.error) {
    return NextResponse.json({ error: cardResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...cardResult.data,
    historico: historyResult.data || [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; cardId: string }> }
) {
  const { id, cardId } = await params;
  const body = await req.json();
  const now = new Date().toISOString();

  // If the column is changing, we need to record history
  if (body.coluna) {
    // Get current card to know the previous column
    const { data: currentCard } = await supabase
      .from("kanban_cards")
      .select("coluna")
      .eq("id", cardId)
      .eq("projeto_id", id)
      .single();

    if (currentCard && currentCard.coluna !== body.coluna) {
      // Record the status change in history
      await supabase.from("kanban_historico").insert({
        card_id: cardId,
        coluna_anterior: currentCard.coluna,
        coluna_nova: body.coluna,
        data_mudanca: now,
      });
    }
  }

  const { data, error } = await supabase
    .from("kanban_cards")
    .update({ ...body, data_atualizacao: now })
    .eq("id", cardId)
    .eq("projeto_id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; cardId: string }> }
) {
  const { id, cardId } = await params;
  const { error } = await supabase
    .from("kanban_cards")
    .delete()
    .eq("id", cardId)
    .eq("projeto_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
