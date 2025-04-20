
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Users, 
  BarChart4, 
  Wallet, 
  Clock, 
  FileCheck, 
  MessageSquare, 
  FolderOpen, 
  Settings, 
  HelpCircle, 
  X 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { 
      icon: FileText, 
      label: "Financeiro", 
      path: "/financial",
      children: [
        { label: "Notas Fiscais", path: "/financial/invoices" },
        { label: "Boletos", path: "/financial/bank-slips" },
        { label: "Fluxo de Caixa", path: "/financial/cash-flow" },
        { label: "Relatórios", path: "/financial/reports" },
        { label: "Categorias", path: "/financial/categories" },
        { label: "Conciliação", path: "/financial/reconciliation" },
      ]
    },
    { 
      icon: Calendar, 
      label: "Obrigações", 
      path: "/obligations",
      children: [
        { label: "Painel", path: "/obligations/dashboard" },
        { label: "Guias Fiscais", path: "/obligations/tax-guides" },
        { label: "Calendário", path: "/obligations/calendar" },
      ]
    },
    { 
      icon: Users, 
      label: "Clientes", 
      path: "/clients",
      children: [
        { label: "Cadastros", path: "/clients/list" },
        { label: "Comunicações", path: "/clients/communications" },
      ]
    },
    { 
      icon: Clock, 
      label: "Tarefas", 
      path: "/tasks",
      children: [
        { label: "Minhas Tarefas", path: "/tasks/my-tasks" },
        { label: "Equipe", path: "/tasks/team" },
      ]
    },
    { 
      icon: FolderOpen, 
      label: "Documentos", 
      path: "/documents",
      children: [
        { label: "Recepção", path: "/documents/reception" },
        { label: "Armazenamento", path: "/documents/storage" },
      ]
    },
    { icon: MessageSquare, label: "Meu App", path: "/client-portal" },
  ];

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <aside 
      className={cn(
        "fixed top-16 bottom-0 left-0 w-64 bg-sidebar-background text-sidebar-foreground z-40 transition-transform duration-300 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Close button - mobile only */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1 text-sidebar-foreground hover:text-white rounded-full"
        >
          <X size={18} />
        </button>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <div key={item.label}>
              <div
                onClick={() => item.children && toggleExpand(item.label)}
                className={cn(
                  "flex items-center py-3 px-4 rounded-md text-sm font-medium cursor-pointer",
                  "hover:bg-sidebar-accent transition-colors duration-200",
                  item.children ? "justify-between" : ""
                )}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3 text-sidebar-primary" />
                  <span>{item.label}</span>
                </div>
                {item.children && (
                  <svg
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      expandedItem === item.label ? "rotate-180" : ""
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>

              {item.children && expandedItem === item.label && (
                <div className="mt-1 ml-6 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className="block py-2 px-4 rounded-md text-sm text-opacity-80 hover:bg-sidebar-accent hover:text-opacity-100 transition-colors duration-200"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-1">
          <Link
            to="/settings"
            className="flex items-center py-3 px-4 rounded-md text-sm font-medium hover:bg-sidebar-accent transition-colors duration-200"
          >
            <Settings className="h-5 w-5 mr-3 text-sidebar-primary" />
            <span>Configurações</span>
          </Link>
          <Link
            to="/help"
            className="flex items-center py-3 px-4 rounded-md text-sm font-medium hover:bg-sidebar-accent transition-colors duration-200"
          >
            <HelpCircle className="h-5 w-5 mr-3 text-sidebar-primary" />
            <span>Ajuda</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
