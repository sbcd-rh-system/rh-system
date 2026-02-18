import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Projeto = {
  id: string;
  nome: string;
  setor: string | null;
  descricao: string | null;
  status: "ativo" | "manutencao" | "inativo";
  versao: string | null;
  url_base: string | null;
  logo_url: string | null;
  responsavel: string | null;
  email_contato: string | null;
  data_criacao: string;
  data_atualizacao: string;
  criado_por: string | null;
};
