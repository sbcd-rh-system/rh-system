import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("kanban_cards")
    .select("*")
    .eq("projeto_id", id)
    .order("posicao", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("kanban_cards")
    .insert({ ...body, projeto_id: id, data_criacao: now, data_atualizacao: now })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Register initial status in history
  await supabase.from("kanban_historico").insert({
    card_id: data.id,
    coluna_anterior: null,
    coluna_nova: data.coluna,
    data_mudanca: now,
  });

  return NextResponse.json(data, { status: 201 });
}
