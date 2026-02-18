import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const setor = url.searchParams.get("setor");
  const search = url.searchParams.get("search");
  const orderBy = url.searchParams.get("orderBy") ?? "data_atualizacao";
  const order = url.searchParams.get("order") ?? "desc";

  let query = supabase.from("projetos").select("*");

  if (status && status !== "todos") query = query.eq("status", status);
  if (setor && setor !== "todos") query = query.eq("setor", setor);
  if (search) query = query.ilike("nome", `%${search}%`);

  query = query.order(orderBy, { ascending: order === "asc" });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { nome, setor, descricao, responsavel, email_contato, url_base, versao } = body;

  const { data, error } = await supabase
    .from("projetos")
    .insert([
      {
        nome,
        setor,
        descricao,
        responsavel,
        email_contato,
        url_base,
        versao,
        status: "ativo",
        data_atualizacao: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
