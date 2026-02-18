import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface GitHubCommit {
  commit: {
    author: {
      date: string;
    };
  };
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Extrai owner e repo de URLs como:
    // https://github.com/owner/repo
    // https://github.com/owner/repo.git
    // github.com/owner/repo
    const match = url.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?$/i);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchLatestCommitFromGitHub(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      { headers }
    );

    if (!response.ok) {
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const commits: GitHubCommit[] = await response.json();
    if (commits.length > 0) {
      return commits[0].commit.author.date;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar commits do GitHub:", error);
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Busca o projeto
    const { data: projeto, error: fetchError } = await supabase
      .from("projetos")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !projeto) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Valida se tem URL base
    if (!projeto.url_base) {
      return NextResponse.json(
        { error: "Projeto não possui URL base configurada" },
        { status: 400 }
      );
    }

    // Extrai owner e repo da URL
    const parsed = parseGitHubUrl(projeto.url_base);
    if (!parsed) {
      return NextResponse.json(
        { error: "URL base não é um repositório GitHub válido" },
        { status: 400 }
      );
    }

    // Busca o último commit
    const commitDate = await fetchLatestCommitFromGitHub(
      parsed.owner,
      parsed.repo
    );

    if (!commitDate) {
      return NextResponse.json(
        { error: "Não foi possível buscar commits do repositório" },
        { status: 500 }
      );
    }

    // Atualiza o projeto com a data do último commit
    const { data: updated, error: updateError } = await supabase
      .from("projetos")
      .update({
        data_atualizacao: commitDate,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao atualizar projeto:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar projeto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sincronizado com sucesso",
      data_atualizacao: commitDate,
      projeto: updated,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
