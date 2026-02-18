-- Create projects table
create table public.projetos (
    id uuid primary key default gen_random_uuid (),
    nome text not null,
    setor text,
    descricao text,
    status text check (
        status in (
            'ativo',
            'construcao',
            'inativo'
        )
    ) default 'ativo',
    versao text,
    url_base text,
    logo_url text,
    responsavel text,
    email_contato text,
    data_criacao timestamptz default now (),
    data_atualizacao timestamptz default now (),
    criado_por text
);

-- Establish simple updated_at logic
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.projetos
  for each row execute procedure moddatetime (data_atualizacao);