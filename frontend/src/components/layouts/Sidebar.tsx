import { useState } from 'react';
   import { cn } from '@/lib/utils';
   import { Button } from '@/components/ui/button';
   import { Link } from 'react-router-dom';
   import { LayoutDashboard, FileText, Briefcase, Users, Clock, Folder, MessageSquare, Settings, HelpCircle } from 'lucide-react';

   interface SidebarProps {
     isOpen: boolean;
     onClose: () => void;
   }

   export function Sidebar({ isOpen, onClose }: SidebarProps) {
     const [expandedItems, setExpandedItems] = useState<string[]>([]);

     const toggleExpand = (item: string) => {
       if (expandedItems.includes(item)) {
         setExpandedItems(expandedItems.filter((i) => i !== item));
       } else {
         setExpandedItems([...expandedItems, item]);
       }
     };

     return (
       <div
         className={cn(
           'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background transform transition-transform duration-300',
           isOpen ? 'translate-x-0' : '-translate-x-full'
         )}
       >
         <div className="flex items-center justify-between p-4 border-b border-border">
           <h2 className="text-xl font-bold">ContáPro</h2>
           <Button variant="ghost" size="icon" onClick={onClose}>
             <span className="sr-only">Fechar menu</span>
             ✕
           </Button>
         </div>

         <nav className="p-4 space-y-2">
           <Link to="/" className="flex items-center p-2 rounded-md hover:bg-sidebar-hover">
             <LayoutDashboard className="w-5 h-5 mr-3" />
             Dashboard
           </Link>

           <div>
             <button
               onClick={() => toggleExpand('financeiro')}
               className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-hover"
             >
               <FileText className="w-5 h-5 mr-3" />
               Financeiro
               <span className="ml-auto">{expandedItems.includes('financeiro') ? '−' : '+'}</span>
             </button>
             {expandedItems.includes('financeiro') && (
               <div className="pl-8 space-y-1">
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Notas Fiscais
                 </Link>
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Boletos
                 </Link>
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Fluxo de Caixa
                 </Link>
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Relatórios
                 </Link>
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Categorias
                 </Link>
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Conciliação
                 </Link>
               </div>
             )}
           </div>

           <div>
             <button
               onClick={() => toggleExpand('obrigacoes')}
               className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-hover"
             >
               <Briefcase className="w-5 h-5 mr-3" />
               Obrigações
               <span className="ml-auto">{expandedItems.includes('obrigacoes') ? '−' : '+'}</span>
             </button>
             {expandedItems.includes('obrigacoes') && (
               <div className="pl-8 space-y-1">
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Item 1
                 </Link>
               </div>
             )}
           </div>

           <div>
             <button
               onClick={() => toggleExpand('clientes')}
               className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-hover"
             >
               <Users className="w-5 h-5 mr-3" />
               Clientes
               <span className="ml-auto">{expandedItems.includes('clientes') ? '−' : '+'}</span>
             </button>
             {expandedItems.includes('clientes') && (
               <div className="pl-8 space-y-1">
                 <Link to="/clientes/cadastros" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Cadastros
                 </Link>
               </div>
             )}
           </div>

           <div>
             <button
               onClick={() => toggleExpand('tarefas')}
               className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-hover"
             >
               <Clock className="w-5 h-5 mr-3" />
               Tarefas
               <span className="ml-auto">{expandedItems.includes('tarefas') ? '−' : '+'}</span>
             </button>
             {expandedItems.includes('tarefas') && (
               <div className="pl-8 space-y-1">
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Item 1
                 </Link>
               </div>
             )}
           </div>

           <div>
             <button
               onClick={() => toggleExpand('documentos')}
               className="flex items-center w-full p-2 rounded-md hover:bg-sidebar-hover"
             >
               <Folder className="w-5 h-5 mr-3" />
               Documentos
               <span className="ml-auto">{expandedItems.includes('documentos') ? '−' : '+'}</span>
             </button>
             {expandedItems.includes('documentos') && (
               <div className="pl-8 space-y-1">
                 <Link to="#" className="block p-2 rounded-md hover:bg-sidebar-hover">
                   Item 1
                 </Link>
               </div>
             )}
           </div>

           <Link to="#" className="flex items-center p-2 rounded-md hover:bg-sidebar-hover">
             <MessageSquare className="w-5 h-5 mr-3" />
             Meu App
           </Link>

           <Link to="#" className="flex items-center p-2 rounded-md hover:bg-sidebar-hover">
             <Settings className="w-5 h-5 mr-3" />
             Configurações
           </Link>

           <Link to="#" className="flex items-center p-2 rounded-md hover:bg-sidebar-hover">
             <HelpCircle className="w-5 h-5 mr-3" />
             Ajuda
           </Link>
         </nav>
       </div>
     );
   }