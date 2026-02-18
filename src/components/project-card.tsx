"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  ExternalLink,
  Edit2,
  History,
  Download,
  Power,
  Trash2,
  Clock,
  Tag,
  Kanban,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StatusBadge } from "@/components/status-badge";
import type { Projeto } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const SECTOR_ICONS: Record<string, string> = {
  "Saúde Pública": "🏥",
  Saúde: "⚕️",
  Corporativo: "🏢",
  Educação: "🎓",
  Financeiro: "💰",
  Tecnologia: "💻",
};

interface ProjectCardProps {
  projeto: Projeto;
  onEdit: (projeto: Projeto) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (projeto: Projeto) => void;
}

export function ProjectCard({
  projeto,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const icon = SECTOR_ICONS[projeto.setor ?? ""] ?? "📁";
  const timeAgo = formatDistanceToNow(new Date(projeto.data_atualizacao), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700",
        "shadow-sm hover:shadow-lg dark:hover:shadow-gray-900/40 transition-all duration-300",
        "hover:-translate-y-0.5 flex flex-col overflow-hidden"
      )}
    >
      {/* Top accent bar */}
      <div
        className={cn(
          "h-1 w-full",
          projeto.status === "ativo"
            ? "bg-green-500"
            : projeto.status === "manutencao"
            ? "bg-yellow-400"
            : "bg-gray-300 dark:bg-gray-600"
        )}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xl shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                {projeto.nome}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {projeto.setor}
              </p>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden py-1">
                    {projeto.url_base && (
                      <a
                        href={projeto.url_base}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Acessar projeto
                      </a>
                    )}
                    <button
                      onClick={() => {
                        router.push(`/projetos/${projeto.id}/kanban`);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Kanban className="w-4 h-4" /> Ver Kanban
                    </button>
                    <button
                      onClick={() => {
                        onEdit(projeto);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" /> Editar informações
                    </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <History className="w-4 h-4" /> Ver histórico
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4" /> Exportar dados
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => {
                      onToggleStatus(projeto);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Power className="w-4 h-4" />
                    {projeto.status === "ativo" ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => {
                      onDelete(projeto.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Deletar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {projeto.descricao && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {projeto.descricao}
          </p>
        )}

        {/* Status + meta */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={projeto.status} />
          {projeto.versao && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Tag className="w-3 h-3" />
              v{projeto.versao}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Atualizado {timeAgo}</span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-5 flex items-center gap-2">
        {projeto.url_base ? (
          <a
            href={projeto.url_base}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Acessar
          </a>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed"
          >
            Sem URL
          </button>
        )}
        <button
          onClick={() => router.push(`/projetos/${projeto.id}/kanban`)}
          title="Ver Kanban"
          className="px-3 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 text-sm font-medium rounded-xl transition-colors"
        >
          <Kanban className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(projeto)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-xl transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
