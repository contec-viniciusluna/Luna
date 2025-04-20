import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  TrendingUp, AlertTriangle, CalendarDays, DollarSign, 
  ArrowUpRight, ArrowDownRight, FileText, CreditCard, 
  BarChart2, FileCheck, Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dashboard widget components
const MetricsWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Visão Geral</CardTitle>
      <CardDescription>Métricas de desempenho dos últimos 30 dias</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Clientes Ativos</span>
            <Badge variant="outline" className="font-normal bg-primary-50 text-primary-700">
              +5%
            </Badge>
          </div>
          <div className="text-2xl font-bold">87</div>
          <Progress value={87} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Faturamento</span>
            <Badge variant="outline" className="font-normal bg-success/10 text-success">
              +12%
            </Badge>
          </div>
          <div className="text-2xl font-bold">R$ 32.450</div>
          <Progress value={75} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Obrigações</span>
            <Badge variant="outline" className="font-normal bg-warning/10 text-warning">
              98%
            </Badge>
          </div>
          <div className="text-2xl font-bold">56/57</div>
          <Progress value={98} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tarefas</span>
            <Badge variant="outline" className="font-normal bg-primary-50 text-primary-700">
              85%
            </Badge>
          </div>
          <div className="text-2xl font-bold">17/20</div>
          <Progress value={85} className="h-2" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const FinancialSummaryWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Resumo Financeiro</CardTitle>
      <CardDescription>Visão do mês atual</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-success/10 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-2xl font-bold">R$ 42.350</p>
              </div>
              <div className="bg-success/20 p-2 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
            </div>
            <div className="text-sm text-success mt-2 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% vs. mês anterior</span>
            </div>
          </div>
          
          <div className="bg-destructive/10 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold">R$ 28.120</p>
              </div>
              <div className="bg-destructive/20 p-2 rounded-full">
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <div className="text-sm text-destructive mt-2 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>3% vs. mês anterior</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Saldo Líquido</span>
            <span className="text-success font-medium">R$ 14.230</span>
          </div>
          <Progress value={65} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Meta: R$ 22.000</span>
            <span>65% atingido</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ObligationsWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium">Obrigações Pendentes</CardTitle>
          <CardDescription>Próximos 7 dias</CardDescription>
        </div>
        <Badge variant="destructive">5 pendentes</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { client: "Empresa ABC Ltda", obligation: "DARF IRPJ", deadline: "Hoje", status: "urgent" },
          { client: "XYZ Comércio S.A.", obligation: "GFIP", deadline: "Amanhã", status: "urgent" },
          { client: "Consultoria 123", obligation: "SPED Contábil", deadline: "Em 2 dias", status: "warning" },
          { client: "Distribuidora Fast", obligation: "DCTF", deadline: "Em 4 dias", status: "normal" },
          { client: "Tech Solutions", obligation: "RAIS", deadline: "Em 7 dias", status: "normal" }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                item.status === 'urgent' ? 'bg-destructive' : 
                item.status === 'warning' ? 'bg-warning' : 'bg-primary'
              }`} />
              <div>
                <p className="text-sm font-medium">{item.obligation}</p>
                <p className="text-xs text-muted-foreground">{item.client}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant={
                item.status === 'urgent' ? 'destructive' : 
                item.status === 'warning' ? 'default' : 'outline'
              } className="mr-2">
                {item.deadline}
              </Badge>
              <Button variant="outline" size="sm">
                <FileCheck className="h-3 w-3 mr-1" />
                <span className="text-xs">Verificar</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="link" className="w-full mt-2">
        Ver todas as obrigações
      </Button>
    </CardContent>
  </Card>
);

const BirthdaysWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Aniversariantes</CardTitle>
      <CardDescription>Próximos 30 dias</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { name: "João Silva", company: "Empresa ABC", date: "Hoje", photo: null },
          { name: "Maria Oliveira", company: "XYZ Comércio", date: "Amanhã", photo: null },
          { name: "Carlos Santos", company: "Tech Solutions", date: "23/04", photo: null },
          { name: "Ana Rodrigues", company: "Consultoria 123", date: "28/04", photo: null },
        ].map((person, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {person.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{person.name}</p>
              <p className="text-xs text-muted-foreground">{person.company}</p>
            </div>
            <div>
              <Badge variant={person.date === "Hoje" ? "default" : person.date === "Amanhã" ? "secondary" : "outline"} 
                className={person.date === "Hoje" ? "bg-success text-white" : person.date === "Amanhã" ? "bg-warning text-white" : ""}>
                {person.date}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <Button variant="link" className="w-full mt-2">
        Ver todos
      </Button>
    </CardContent>
  </Card>
);

const TasksWidget = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-medium">Minhas Tarefas</CardTitle>
          <CardDescription>Prioridades para hoje</CardDescription>
        </div>
        <Badge>7 pendentes</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {[
          { title: "Revisar SPED Empresa ABC", priority: "high", deadline: "11:00" },
          { title: "Conciliação bancária XYZ", priority: "high", deadline: "13:30" },
          { title: "Enviar relatório mensal", priority: "medium", deadline: "15:00" },
          { title: "Conferir notas fiscais", priority: "medium", deadline: "16:45" },
          { title: "Reunião com cliente Tech Solutions", priority: "low", deadline: "17:30" },
        ].map((task, index) => (
          <div key={index} className="flex items-center p-2 rounded-md hover:bg-muted/50">
            <div className="mr-3">
              <input type="checkbox" className="h-4 w-4 rounded-sm border-2 border-primary accent-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{task.title}</p>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">{task.deadline}</span>
              <Badge variant={
                task.priority === 'high' ? 'destructive' : 
                task.priority === 'medium' ? 'default' : 'outline'
              }>
                {task.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <Button variant="link" className="w-full mt-2">
        Ver todas as tarefas
      </Button>
    </CardContent>
  </Card>
);

// Main dashboard component with draggable widgets
export default function Dashboard() {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    return saved ? JSON.parse(saved) : [
      { id: "metrics", element: <MetricsWidget />, size: "col-span-2" },
      { id: "financial", element: <FinancialSummaryWidget />, size: "col-span-2" },
      { id: "obligations", element: <ObligationsWidget />, size: "col-span-1" },
      { id: "birthdays", element: <BirthdaysWidget />, size: "col-span-1" },
      { id: "tasks", element: <TasksWidget />, size: "col-span-2" },
    ];
  });

  // Persist widget order to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  // Handle drag and drop reordering
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgets(items);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu escritório contábil</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="h-4 w-4 mr-2" />
            Abril 2025
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="mb-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="obligations">Obrigações</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
      </Tabs>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${widget.size} transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-lg border-2 border-primary' : ''
                      }`}
                    >
                      {widget.element}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}