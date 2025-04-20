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

const MetricsWidget = () => (
  <Card>...</Card>
);

const FinancialSummaryWidget = () => (
  <Card>...</Card>
);

const ObligationsWidget = () => (
  <Card>...</Card>
);

const BirthdaysWidget = () => (
  <Card>...</Card>
);

const TasksWidget = () => (
  <Card>...</Card>
);

const widgetMap = {
  metrics: { element: <MetricsWidget />, size: "col-span-2" },
  financial: { element: <FinancialSummaryWidget />, size: "col-span-2" },
  obligations: { element: <ObligationsWidget />, size: "col-span-1" },
  birthdays: { element: <BirthdaysWidget />, size: "col-span-1" },
  tasks: { element: <TasksWidget />, size: "col-span-2" },
};

export default function Dashboard() {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboardWidgetOrder');
    const defaultOrder = ["metrics", "financial", "obligations", "birthdays", "tasks"];
    const order = saved ? JSON.parse(saved) : defaultOrder;
    return order.map(id => ({ id, ...widgetMap[id] }));
  });

  useEffect(() => {
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(widgets.map(w => w.id)));
  }, [widgets]);

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
