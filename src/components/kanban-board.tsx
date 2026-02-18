"use client";

import { useState, useRef } from "react";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Check,
  GripVertical,
  Flag,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type KanbanCard = {
  id: string;
  projeto_id: string;
  coluna: string;
  titulo: string;
  descricao: string | null;
  cor: string;
  prioridade: string;
  posicao: number;
  data_criacao: string;
  data_atualizacao: string;
};

export type KanbanColumn = {
  id: string;
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
};

const COLUMNS: KanbanColumn[] = [
  {
    id: "ideias",
    label: "Ideias",
    color: "bg-purple-500",
    icon: Lightbulb,
    description: "Novas ideias e sugestões",
  },
  {
    id: "a_fazer",
    label: "A Fazer",
    color: "bg-blue-500",
    icon: Flag,
    description: "Tarefas planejadas",
  },
  {
    id: "em_andamento",
    label: "Em Andamento",
    color: "bg-yellow-500",
    icon: Loader2,
    description: "Trabalho em progresso",
  },
  {
    id: "concluido",
    label: "Concluído",
    color: "bg-green-500",
    icon: Check,
    description: "Tarefas finalizadas",
  },
];

const CARD_COLORS = [
  { value: "blue", label: "Azul", class: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700" },
  { value: "purple", label: "Roxo", class: "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700" },
  { value: "green", label: "Verde", class: "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700" },
  { value: "yellow", label: "Amarelo", class: "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700" },
  { value: "red", label: "Vermelho", class: "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700" },
  { value: "gray", label: "Cinza", class: "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600" },
];

const PRIORITY_LABELS: Record<string, { label: string; class: string }> = {
  baixa: { label: "Baixa", class: "text-gray-500 bg-gray-100 dark:bg-gray-700" },
  media: { label: "Média", class: "text-blue-600 bg-blue-50 dark:bg-blue-900/30" },
  alta: { label: "Alta", class: "text-orange-600 bg-orange-50 dark:bg-orange-900/30" },
  urgente: { label: "Urgente", class: "text-red-600 bg-red-50 dark:bg-red-900/30" },
};

function getCardColorClass(cor: string) {
  return CARD_COLORS.find((c) => c.value === cor)?.class ?? CARD_COLORS[0].class;
}

interface CardFormProps {
  initial?: Partial<KanbanCard>;
  onSave: (data: { titulo: string; descricao: string; cor: string; prioridade: string }) => void;
  onCancel: () => void;
  saving?: boolean;
}

function CardForm({ initial, onSave, onCancel, saving }: CardFormProps) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [cor, setCor] = useState(initial?.cor ?? "blue");
  const [prioridade, setPrioridade] = useState(initial?.prioridade ?? "media");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-md space-y-2.5">
      <input
        autoFocus
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título do card..."
        className="w-full text-sm font-medium bg-transparent border-b border-gray-200 dark:border-gray-600 pb-1 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
      />
      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição (opcional)..."
        rows={2}
        className="w-full text-xs bg-transparent resize-none text-gray-600 dark:text-gray-400 placeholder-gray-400 focus:outline-none"
      />
      {/* Color picker */}
      <div className="flex items-center gap-1.5">
        {CARD_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => setCor(c.value)}
            title={c.label}
            className={cn(
              "w-5 h-5 rounded-full border-2 transition-transform",
              c.value === "blue" && "bg-blue-400",
              c.value === "purple" && "bg-purple-400",
              c.value === "green" && "bg-green-400",
              c.value === "yellow" && "bg-yellow-400",
              c.value === "red" && "bg-red-400",
              c.value === "gray" && "bg-gray-400",
              cor === c.value ? "border-gray-800 dark:border-white scale-110" : "border-transparent"
            )}
          />
        ))}
      </div>
      {/* Priority */}
      <select
        value={prioridade}
        onChange={(e) => setPrioridade(e.target.value)}
        className="w-full text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => titulo.trim() && onSave({ titulo, descricao, cor, prioridade })}
          disabled={!titulo.trim() || saving}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

interface KanbanCardItemProps {
  card: KanbanCard;
  onEdit: (card: KanbanCard) => void;
  onDelete: (id: string) => void;
  onDragStart: (card: KanbanCard) => void;
  onDragEnd: () => void;
  editingId: string | null;
  onSaveEdit: (card: KanbanCard, data: { titulo: string; descricao: string; cor: string; prioridade: string }) => void;
  onCancelEdit: () => void;
  saving: boolean;
}

function KanbanCardItem({
  card,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  editingId,
  onSaveEdit,
  onCancelEdit,
  saving,
}: KanbanCardItemProps) {
  const isEditing = editingId === card.id;
  const priority = PRIORITY_LABELS[card.prioridade] ?? PRIORITY_LABELS.media;

  if (isEditing) {
    return (
      <CardForm
        initial={card}
        onSave={(data) => onSaveEdit(card, data)}
        onCancel={onCancelEdit}
        saving={saving}
      />
    );
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(card)}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-xl border p-3 cursor-grab active:cursor-grabbing group",
        "shadow-sm hover:shadow-md transition-all duration-200",
        getCardColorClass(card.cor)
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
              {card.titulo}
            </p>
            {card.descricao && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-3">
                {card.descricao}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(card)}
            className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", priority.class)}>
          {priority.label}
        </span>
      </div>
    </div>
  );
}

interface ColumnProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  onAddCard: (coluna: string, data: { titulo: string; descricao: string; cor: string; prioridade: string }) => void;
  onEditCard: (card: KanbanCard, data: { titulo: string; descricao: string; cor: string; prioridade: string }) => void;
  onDeleteCard: (id: string) => void;
  onDragStart: (card: KanbanCard) => void;
  onDragEnd: () => void;
  onDrop: (coluna: string) => void;
  isDragOver: boolean;
  editingId: string | null;
  addingInCol: string | null;
  setAddingInCol: (col: string | null) => void;
  setEditingId: (id: string | null) => void;
  saving: boolean;
}

function Column({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragOver,
  editingId,
  addingInCol,
  setAddingInCol,
  setEditingId,
  saving,
}: ColumnProps) {
  const Icon = column.icon;
  const isAdding = addingInCol === column.id;

  return (
    <div
      className={cn(
        "flex flex-col min-w-[260px] w-[260px] bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 transition-colors duration-200",
        isDragOver
          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40"
          : "border-transparent"
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(column.id)}
    >
      {/* Column header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", column.color)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {column.label}
          </h3>
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 px-3 pb-3 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[60px]">
        {cards.map((card) => (
          <KanbanCardItem
            key={card.id}
            card={card}
            onEdit={(c) => setEditingId(c.id)}
            onDelete={onDeleteCard}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            editingId={editingId}
            onSaveEdit={onEditCard}
            onCancelEdit={() => setEditingId(null)}
            saving={saving}
          />
        ))}

        {/* Add form */}
        {isAdding && (
          <CardForm
            onSave={(data) => {
              onAddCard(column.id, data);
              setAddingInCol(null);
            }}
            onCancel={() => setAddingInCol(null)}
            saving={saving}
          />
        )}
      </div>

      {/* Add button */}
      {!isAdding && (
        <div className="px-3 pb-3">
          <button
            onClick={() => setAddingInCol(column.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors border border-dashed border-gray-300 dark:border-gray-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar card
          </button>
        </div>
      )}
    </div>
  );
}

interface KanbanBoardProps {
  projetoId: string;
  cards: KanbanCard[];
  onAdd: (coluna: string, data: { titulo: string; descricao: string; cor: string; prioridade: string }) => Promise<void>;
  onEdit: (card: KanbanCard, data: { titulo: string; descricao: string; cor: string; prioridade: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMove: (cardId: string, newColuna: string) => Promise<void>;
  saving: boolean;
}

export function KanbanBoard({ cards, onAdd, onEdit, onDelete, onMove, saving }: KanbanBoardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingInCol, setAddingInCol] = useState<string | null>(null);
  const [dragCard, setDragCard] = useState<KanbanCard | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cardsByColumn = (colId: string) =>
    cards.filter((c) => c.coluna === colId).sort((a, b) => a.posicao - b.posicao);

  const handleDrop = async (coluna: string) => {
    if (dragCard && dragCard.coluna !== coluna) {
      await onMove(dragCard.id, coluna);
    }
    setDragCard(null);
    setDragOverCol(null);
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto pb-4 min-h-0"
    >
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          column={col}
          cards={cardsByColumn(col.id)}
          onAddCard={onAdd}
          onEditCard={onEdit}
          onDeleteCard={onDelete}
          onDragStart={(card) => {
            setDragCard(card);
            setDragOverCol(card.coluna);
          }}
          onDragEnd={() => {
            setDragCard(null);
            setDragOverCol(null);
          }}
          onDrop={handleDrop}
          isDragOver={dragOverCol === col.id && dragCard?.coluna !== col.id}
          editingId={editingId}
          addingInCol={addingInCol}
          setAddingInCol={setAddingInCol}
          setEditingId={setEditingId}
          saving={saving}
        />
      ))}
    </div>
  );
}
