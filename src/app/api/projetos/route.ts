import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "todos";
    const setor = searchParams.get("setor") || "todos";
    const search = searchParams.get("search") || "";
    const orderBy = searchParams.get("orderBy") || "data_atualizacao";
    const order = searchParams.get("order") || "desc";

    let query = supabase.from("projetos").select("*");

    if (status !== "todos") {
      query = query.eq("status", status);
    }

    if (setor !== "todos") {
      query = query.eq("setor", setor);
    }

    if (search) {
      query = query.ilike("nome", `%${search}%`);
    }

    query = query.order(orderBy, { ascending: order === "asc" });

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("projetos")
      .insert([
        {
          nome: body.nome,
          setor: body.setor,
          descricao: body.descricao,
          status: "ativo",
          versao: body.versao,
          url_base: body.url_base,
          responsavel: body.responsavel,
          email_contato: body.email_contato,
          data_criacao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
