"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useTheme } from "@/components/theme-provider";
import {
  Sun,
  Moon,
  Bell,
  Shield,
  User,
  Palette,
  Globe,
  Database,
} from "lucide-react";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Gerencie suas preferências e configurações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil */}
        <Section icon={User} title="Perfil do Usuário">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl text-white font-bold">
              J
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                João Silva
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                joao@rh.gov.br
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                Administrador
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Nome completo
              </label>
              <input
                defaultValue="João Silva"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                defaultValue="joao@rh.gov.br"
                type="email"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
              Salvar Alterações
            </button>
          </div>
        </Section>

        {/* Aparência */}
        <Section icon={Palette} title="Aparência">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tema da Interface
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                  theme === "light"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Claro
                </span>
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Escuro
                </span>
              </button>
            </div>
          </div>
        </Section>

        {/* Notificações */}
        <Section icon={Bell} title="Notificações">
          <ToggleRow
            label="Notificações por Email"
            description="Receber alertas de alterações importantes por email"
            checked={true}
            onChange={() => {}}
          />
          <ToggleRow
            label="Alertas de Manutenção"
            description="Ser notificado quando projetos entrarem em manutenção"
            checked={true}
            onChange={() => {}}
          />
          <ToggleRow
            label="Novos Projetos"
            description="Alertas quando novos projetos forem criados"
            checked={false}
            onChange={() => {}}
          />
          <ToggleRow
            label="Relatórios Semanais"
            description="Resumo semanal de atividades em todos os projetos"
            checked={true}
            onChange={() => {}}
          />
        </Section>

        {/* Segurança */}
        <Section icon={Shield} title="Segurança">
          <div className="space-y-3">
            <ToggleRow
              label="Autenticação de Dois Fatores"
              description="Adiciona camada extra de segurança ao login"
              checked={false}
              onChange={() => {}}
            />
            <ToggleRow
              label="Sessões Ativas"
              description="Listar e encerrar sessões em outros dispositivos"
              checked={true}
              onChange={() => {}}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Alterar senha
            </button>
          </div>
        </Section>

        {/* Sistema */}
        <Section icon={Globe} title="Sistema">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Idioma
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Português (Brasil)</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Fuso Horário
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>America/Sao_Paulo (UTC-3)</option>
                <option>America/Fortaleza (UTC-3)</option>
                <option>America/Manaus (UTC-4)</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Dados */}
        <Section icon={Database} title="Dados e Exportação">
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Exporte ou importe todos os dados do sistema.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                Exportar Tudo
              </button>
              <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Importar Dados
              </button>
            </div>
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                Zona de Perigo
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mb-2">
                Estas ações são irreversíveis.
              </p>
              <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors">
                Limpar todos os dados
              </button>
            </div>
          </div>
        </Section>
      </div>
    </AppLayout>
  );
}
