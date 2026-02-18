import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Status = "ativo" | "manutencao" | "inativo";

const config: Record<
  Status,
  { label: string; icon: React.ElementType; classes: string }
> = {
  ativo: {
    label: "Ativo",
    icon: CheckCircle2,
    classes:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  manutencao: {
    label: "Em Manutenção",
    icon: AlertTriangle,
    classes:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  inativo: {
    label: "Inativo",
    icon: XCircle,
    classes:
      "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = (status as Status) in config ? (status as Status) : "inativo";
  const { label, icon: Icon, classes } = config[s];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
        classes
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
