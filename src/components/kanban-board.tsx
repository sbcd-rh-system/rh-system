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
  Eye,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export type KanbanCard = {
  id: string;
  projeto_id: string;
  coluna: string;
  titulo: string;
  descricao: string | null;
  cor: string;
  prioridade: string;
  categoria: string;
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
    id: "testes",
    label: "Testes",
    color: "bg-orange-500",
    icon: FlaskConical,
    description: "Em fase de testes e validação",
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

const CATEGORY_LABELS: Record<string, { label: string; class: string }> = {
  critico: { label: "🔴 Crítico", class: "text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300" },
  manutencao: { label: "🔧 Manutenção", class: "text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300" },
  bug: { label: "🐛 Bug", class: "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300" },
  desenvolvimento: { label: "💻 Desenvolvimento", class: "text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300" },
  ideia: { label: "💡 Ideia", class: "text-purple-700 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300" },
  sugestao: { label: "💬 Sugestão", class: "text-indigo-700 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300" },
  documentacao: { label: "📚 Documentação", class: "text-cyan-700 bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-300" },
  melhoraria: { label: "⚡ Melhoria", class: "text-lime-700 bg-lime-100 dark:bg-lime-900/40 dark:text-lime-300" },
};

function getCardColorClass(cor: string) {
  return CARD_COLORS.find((c) => c.value === cor)?.class ?? CARD_COLORS[0].class;
}

interface CardFormProps {
  initial?: Partial<KanbanCard>;
  onSave: (data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
}

function CardForm({ initial, onSave, onCancel, saving }: CardFormProps) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [cor, setCor] = useState(initial?.cor ?? "blue");
  const [prioridade, setPrioridade] = useState(initial?.prioridade ?? "media");
  const [categoria, setCategoria] = useState(initial?.categoria ?? "desenvolvimento");

  const handleSubmit = async () => {
    if (!titulo.trim()) return;
    await Promise.resolve(onSave({ titulo, descricao, cor, prioridade, categoria }));
  };

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
      {/* Category */}
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="w-full text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
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

interface CardViewModalProps {
  card: KanbanCard | null;
  onClose: () => void;
}

function CardViewModal({ card, onClose }: CardViewModalProps) {
  if (!card) return null;

  const priority = PRIORITY_LABELS[card.prioridade] ?? PRIORITY_LABELS.media;
  const category = CATEGORY_LABELS[card.categoria] ?? CATEGORY_LABELS.desenvolvimento;
  const cardColor = CARD_COLORS.find((c) => c.value === card.cor) ?? CARD_COLORS[0];

  return (
    <Dialog open={!!card} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Visualizar Tarefa</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className={cn("rounded-xl border p-4", cardColor.class)}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {card.titulo}
          </h2>

          {card.descricao && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Descrição
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {card.descricao}
              </p>
            </div>
          )}

          <div className="space-y-2 pt-3 border-t border-gray-300/40 dark:border-gray-600/40">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Prioridade</p>
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium inline-block mt-1", priority.class)}>
                {priority.label}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Categoria</p>
              <span className={cn("text-xs px-2 py-1 rounded-full font-medium inline-block mt-1", category.class)}>
                {category.label}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 capitalize">
                {card.coluna.replace(/_/g, " ")}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Criado em</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {new Date(card.data_criacao).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Atualizado em</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {new Date(card.data_atualizacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface KanbanCardItemProps {
  card: KanbanCard;
  dragCard: KanbanCard | null;
  onEdit: (card: KanbanCard) => void;
  onDelete: (id: string) => void;
  onDragStart: (card: KanbanCard) => void;
  onDragEnd: () => void;
  onDragOverCard?: (cardId: string) => void;
  onDropOnCard?: (draggedCardId: string, targetCardId: string) => void;
  editingId: string | null;
  onSaveEdit: (card: KanbanCard, data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => Promise<void>;
  onCancelEdit: () => void;
  onView: (card: KanbanCard) => void;
  saving: boolean;
}

function KanbanCardItem({
  card,
  dragCard,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDropOnCard,
  editingId,
  onSaveEdit,
  onCancelEdit,
  onView,
  saving,
}: KanbanCardItemProps) {
  const isDraggingRef = useRef(false);
  const isEditing = editingId === card.id;
  const priority = PRIORITY_LABELS[card.prioridade] ?? PRIORITY_LABELS.media;
  const category = CATEGORY_LABELS[card.categoria] ?? CATEGORY_LABELS.desenvolvimento;

  const handleDragStart = (card: KanbanCard) => {
    isDraggingRef.current = true;
    onDragStart(card);
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    onDragEnd();
  };

  const handleCardClick = () => {
    if (!isDraggingRef.current) {
      onView(card);
    }
  };

  const handleDragOverCard = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    // Ignora quando o card passa sobre si mesmo
    if (onDragOverCard && dragCard?.id !== card.id) {
      onDragOverCard(card.id);
    }
  };

  const handleDragLeaveCard = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset if we're actually leaving the card element
    if ((e.relatedTarget as HTMLElement)?.closest('[draggable="true"]') === null) {
      if (onDragOverCard) {
        onDragOverCard('');
      }
    }
  };

  const handleDropOnCard = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    // Só bloqueia propagação se o drag é dentro da mesma coluna (reordenação)
    // Se for de coluna diferente, deixa o evento chegar até a coluna pai (movimento)
    if (dragCard && dragCard.coluna === card.coluna) {
      e.stopPropagation();
      if (onDropOnCard) {
        onDropOnCard(dragCard.id, targetCardId);
      }
    }
  };

  if (isEditing) {
    const handleSave = async (data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => {
      await onSaveEdit(card, data);
      onCancelEdit();
    };

    return (
      <CardForm
        initial={card}
        onSave={handleSave}
        onCancel={onCancelEdit}
        saving={saving}
      />
    );
  }

  return (
    <div
      draggable
      onDragStart={() => handleDragStart(card)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOverCard}
      onDrop={(e) => handleDropOnCard(e, card.id)}
      className={cn(
        "rounded-xl border p-3 cursor-grab active:cursor-grabbing group",
        "shadow-sm hover:shadow-md transition-all duration-200",
        getCardColorClass(card.cor)
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0 cursor-pointer" onClick={handleCardClick}>
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug hover:underline">
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
            onClick={() => onView(card)}
            className="p-1 rounded-md text-gray-400 hover:text-cyan-600 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
            title="Visualizar"
          >
            <Eye className="w-3 h-3" />
          </button>
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
      <div className="mt-2 space-y-1.5">
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium inline-block", priority.class)}>
          {priority.label}
        </span>
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium inline-block ml-1.5", category.class)}>
          {category.label}
        </span>
      </div>
    </div>
  );
}

interface ColumnProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  dragCard: KanbanCard | null;
  onAddCard: (coluna: string, data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => void;
  onEditCard: (card: KanbanCard, data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => void;
  onDeleteCard: (id: string) => void;
  onDragStart: (card: KanbanCard) => void;
  onDragEnd: () => void;
  onDrop: (coluna: string) => void;
  onDragOver: (coluna: string) => void;
  onDragOverCard: (cardId: string) => void;
  onReorderCards: (draggedCardId: string, targetCardId: string) => void;
  isDragOver: boolean;
  editingId: string | null;
  addingInCol: string | null;
  setAddingInCol: (col: string | null) => void;
  setEditingId: (id: string | null) => void;
  setViewingCard: (card: KanbanCard | null) => void;
  saving: boolean;
}

function Column({
  column,
  cards,
  dragCard,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOver,
  onDragOverCard,
  onReorderCards,
  isDragOver,
  editingId,
  addingInCol,
  setAddingInCol,
  setEditingId,
  setViewingCard,
  saving,
}: ColumnProps) {
  const Icon = column.icon;
  const isAdding = addingInCol === column.id;

  return (
    <div
      className={cn(
        "flex flex-col flex-1 min-w-[280px] bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 transition-colors duration-200",
        isDragOver
          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40"
          : "border-transparent"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver(column.id);
      }}
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
      <div
        className="flex-1 px-3 pb-3 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[60px]"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(column.id);
        }}
      >
        {cards.map((card) => (
          <KanbanCardItem
            key={card.id}
            card={card}
            dragCard={dragCard}
            onEdit={(c) => setEditingId(c.id)}
            onDelete={onDeleteCard}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOverCard={onDragOverCard}
            onDropOnCard={onReorderCards}
            editingId={editingId}
            onSaveEdit={onEditCard}
            onCancelEdit={() => setEditingId(null)}
            onView={setViewingCard}
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
  onAdd: (coluna: string, data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => Promise<void>;
  onEdit: (card: KanbanCard, data: { titulo: string; descricao: string; cor: string; prioridade: string; categoria: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMove: (cardId: string, newColuna: string) => Promise<void>;
  onUpdateCards?: (newCards: KanbanCard[]) => void;
  saving: boolean;
}

export function KanbanBoard({ cards, onAdd, onEdit, onDelete, onMove, onUpdateCards, saving }: KanbanBoardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingInCol, setAddingInCol] = useState<string | null>(null);
  const [dragCard, setDragCard] = useState<KanbanCard | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [viewingCard, setViewingCard] = useState<KanbanCard | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cardsByColumn = (colId: string) =>
    cards.filter((c) => c.coluna === colId).sort((a, b) => a.posicao - b.posicao);

  const handleDrop = async (coluna: string) => {
    if (!dragCard) {
      setDragCard(null);
      setDragOverCol(null);
      setDragOverCardId(null);
      return;
    }

    // Se foi solto no mesmo card, não faz nada
    if (dragCard.id === dragOverCardId) {
      setDragCard(null);
      setDragOverCol(null);
      setDragOverCardId(null);
      return;
    }

    // Se foi solto em coluna diferente
    if (dragCard.coluna !== coluna) {
      await onMove(dragCard.id, coluna);
    }
    // Se foi solto em card diferente na mesma coluna, reordena
    else if (dragOverCardId) {
      await handleReorderCards(dragCard.id, dragOverCardId);
    }

    setDragCard(null);
    setDragOverCol(null);
    setDragOverCardId(null);
  };

  const handleReorderCards = async (draggedCardId: string, targetCardId: string) => {
    if (draggedCardId === targetCardId || !dragCard) {
      return;
    }

    const draggedCard = cards.find((c) => c.id === draggedCardId);
    const targetCard = cards.find((c) => c.id === targetCardId);

    if (!draggedCard || !targetCard || draggedCard.coluna !== targetCard.coluna) {
      return;
    }

    // Pega todos os cards da coluna ordenados por posição
    const colCards = cards
      .filter((c) => c.coluna === draggedCard.coluna)
      .sort((a, b) => a.posicao - b.posicao);

    // Detecta direção: de cima pra baixo ou de baixo pra cima
    const draggedIndex = colCards.findIndex((c) => c.id === draggedCardId);
    const targetIndex2 = colCards.findIndex((c) => c.id === targetCardId);
    const movingDown = draggedIndex < targetIndex2;

    // Remove o card arrastado
    const withoutDragged = colCards.filter((c) => c.id !== draggedCardId);
    const targetIndex = withoutDragged.findIndex((c) => c.id === targetCardId);

    // Insere depois se movendo pra baixo, antes se movendo pra cima
    withoutDragged.splice(movingDown ? targetIndex + 1 : targetIndex, 0, draggedCard);

    // Reatribui posições sequenciais
    const reordered = withoutDragged.map((c, i) => ({ ...c, posicao: i }));

    // Atualiza UI imediatamente (optimistic update)
    const updatedCards = cards.map((c) => {
      const reorderedCard = reordered.find((r) => r.id === c.id);
      return reorderedCard ?? c;
    });

    if (onUpdateCards) {
      onUpdateCards(updatedCards);
    }

    // Atualiza servidor em background apenas para os que mudaram de posição
    const projectId = draggedCard.projeto_id;
    reordered.forEach((c) => {
      const original = cards.find((orig) => orig.id === c.id);
      if (original && original.posicao !== c.posicao) {
        fetch(`/api/projetos/${projectId}/kanban/${c.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posicao: c.posicao }),
        }).catch((err) => console.error("Error updating card position:", err));
      }
    });
  };

  return (
    <>
      <CardViewModal card={viewingCard} onClose={() => setViewingCard(null)} />
      <div
        ref={scrollRef}
        className="flex gap-4 pb-4 min-h-0 w-full"
      >
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            cards={cardsByColumn(col.id)}
            dragCard={dragCard}
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
            onDragOver={setDragOverCol}
            onDragOverCard={setDragOverCardId}
            onReorderCards={handleReorderCards}
            isDragOver={dragOverCol === col.id && dragCard?.coluna !== col.id}
            editingId={editingId}
            addingInCol={addingInCol}
            setAddingInCol={setAddingInCol}
            setEditingId={setEditingId}
            setViewingCard={setViewingCard}
            saving={saving}
          />
        ))}
      </div>
    </>
  );
}
