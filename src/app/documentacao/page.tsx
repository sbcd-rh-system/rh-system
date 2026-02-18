import { AppLayout } from "@/components/layout/app-layout";
import { BookOpen } from "lucide-react";

export default function DocumentacaoPage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Documentação
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Guias e referências do sistema.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Documentação em breve
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm max-w-sm">
          A documentação completa do sistema será disponibilizada em breve.
        </p>
      </div>
    </AppLayout>
  );
}
