import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    ativo: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
      label: "Ativo",
    },
    construcao: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
      label: "Em Construção",
    },
    inativo: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-700 dark:text-gray-300",
      label: "Inativo",
    },
  };

  const variant = variants[status] || variants.inativo;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant.bg,
        variant.text
      )}
    >
      {variant.label}
    </span>
  );
}
