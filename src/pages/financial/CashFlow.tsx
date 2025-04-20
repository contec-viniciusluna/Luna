
import { useState } from "react";
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  BarChart3, 
  PieChart,
  TrendingUp,
  CalendarDays
} from "lucide-react";
import { format, subMonths, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from 'date-fns/locale';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Sample data for cash flow
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const categories = [
  { id: 1, name: "Serviços Contábeis", color: "bg-blue-500" },
  { id: 2, name: "Consultoria Tributária", color: "bg-green-500" },
  { id: 3, name: "Folha de Pagamento", color: "bg-purple-500" },
  { id: 4, name: "Escritório", color: "bg-orange-500" },
  { id: 5, name: "Impostos", color: "bg-red-500" },
  { id: 6, name: "Salários", color: "bg-yellow-500" },
  { id: 7, name: "Marketing", color: "bg-pink-500" },
  { id: 8, name: "Software", color: "bg-indigo-500" },
];

const accounts = [
  { id: 1, name: "Conta Principal", bank: "Itaú", balance: 42580.45 },
  { id: 2, name: "Poupança", bank: "Bradesco", balance: 35980.12 },
  { id: 3, name: "Conta Empresarial", bank: "Santander", balance: 18790.35 },
];

// Generate sample transactions
const generateTransactions = (month, year) => {
  const result = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate sample income
  for (let i = 0; i < 15; i++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const categoryId = Math.floor(Math.random() * 3) + 1;
    const accountId = Math.floor(Math.random() * 3) + 1;
    const amount = Math.floor(Math.random() * 3000) + 1000;
    
    result.push({
      id: `income-${i}`,
      date: new Date(year, month, day),
      description: `Serviço para Cliente ${String.fromCharCode(65 + i)}`,
      amount,
      type: "income",
      category: categories.find(c => c.id === categoryId),
      account: accounts.find(a => a.id === accountId),
      status: Math.random() > 0.2 ? "completed" : "pending"
    });
  }
  
  // Generate sample expenses
  for (let i = 0; i < 20; i++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const categoryId = Math.floor(Math.random() * 5) + 4;
    const accountId = Math.floor(Math.random() * 3) + 1;
    const amount = Math.floor(Math.random() * 2000) + 200;
    
    result.push({
      id: `expense-${i}`,
      date: new Date(year, month, day),
      description: `Despesa ${i+1}`,
      amount: -amount,
      type: "expense",
      category: categories.find(c => c.id === categoryId),
      account: accounts.find(a => a.id === accountId),
      status: Math.random() > 0.15 ? "completed" : "pending"
    });
  }
  
  return result.sort((a, b) => b.date - a.date);
};

// Generate monthly summaries for previous 12 months
const generateMonthlySummaries = () => {
  const summaries = [];
  
  for (let i = 0; i < 12; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    
    const income = Math.floor(Math.random() * 20000) + 30000;
    const expenses = Math.floor(Math.random() * 15000) + 15000;
    
    summaries.push({
      month: month,
      income,
      expenses: -expenses,
      balance: income - expenses
    });
  }
  
  return summaries.reverse();
};

const monthlySummaries = generateMonthlySummaries();

export default function CashFlow() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [transactions, setTransactions] = useState(generateTransactions(selectedMonth.getMonth(), selectedMonth.getFullYear()));
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedView, setSelectedView] = useState("month");
  
  // Calculate summaries for the selected month
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBalance = totalIncome + totalExpenses;
  
  // Category breakdown for the selected month
  const incomeByCategory = categories
    .map(category => ({
      ...category,
      total: transactions
        .filter(t => t.category.id === category.id && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);
  
  const expensesByCategory = categories
    .map(category => ({
      ...category,
      total: transactions
        .filter(t => t.category.id === category.id && t.amount < 0)
        .reduce((sum, t) => Math.abs(sum + t.amount), 0)
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  // Function to navigate between months
  const changeMonth = (direction) => {
    const newDate = direction === 'next' 
      ? addMonths(selectedMonth, 1)
      : subMonths(selectedMonth, 1);
    
    setSelectedMonth(newDate);
    setTransactions(generateTransactions(newDate.getMonth(), newDate.getFullYear()));
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">Visualize e controle o fluxo financeiro do seu negócio</p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Conta
              </DropdownMenuItem>
              <DropdownMenuItem>
                Categoria
              </DropdownMenuItem>
              <DropdownMenuItem>
                Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Limpar filtros
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeMonth('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium capitalize">
              {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeMonth('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1 bg-secondary rounded-lg p-0.5">
          <Button 
            variant={selectedView === 'day' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8"
            onClick={() => setSelectedView('day')}
          >
            Dia
          </Button>
          <Button 
            variant={selectedView === 'week' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8"
            onClick={() => setSelectedView('week')}
          >
            Semana
          </Button>
          <Button 
            variant={selectedView === 'month' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8"
            onClick={() => setSelectedView('month')}
          >
            Mês
          </Button>
          <Button 
            variant={selectedView === 'year' ? 'default' : 'ghost'} 
            size="sm" 
            className="h-8"
            onClick={() => setSelectedView('year')}
          >
            Ano
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Receitas</p>
                <p className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
                </p>
              </div>
              <div className="bg-success/20 p-2 rounded-full">
                <ArrowUpRight className="h-5 w-5 text-success" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Meta Mensal</span>
                <span className="text-muted-foreground">R$ 45.000,00</span>
              </div>
              <Progress className="h-2" value={(totalIncome / 45000) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Despesas</p>
                <p className="text-2xl font-bold text-destructive">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(totalExpenses))}
                </p>
              </div>
              <div className="bg-destructive/20 p-2 rounded-full">
                <ArrowDownRight className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Limite Mensal</span>
                <span className="text-muted-foreground">R$ 30.000,00</span>
              </div>
              <Progress className="h-2" value={(Math.abs(totalExpenses) / 30000) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBalance)}
                </p>
              </div>
              <div className={`${totalBalance >= 0 ? 'bg-primary/20' : 'bg-destructive/20'} p-2 rounded-full`}>
                <DollarSign className={`h-5 w-5 ${totalBalance >= 0 ? 'text-primary' : 'text-destructive'}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Saldo das Contas</span>
                <span className="text-muted-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    accounts.reduce((sum, account) => sum + account.balance, 0)
                  )}
                </span>
              </div>
              <div className="flex space-x-1 mt-2">
                {accounts.map((account) => (
                  <Badge key={account.id} variant="outline" className="text-xs font-normal">
                    {account.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="forecast">Previsões</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Evolução Mensal
                </CardTitle>
                <CardDescription>Histórico dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div className="grid grid-cols-6 gap-2 w-full h-[200px] items-end px-4">
                    {monthlySummaries.slice(-6).map((summary, index) => (
                      <div key={index} className="relative flex flex-col h-full justify-end space-y-1 group">
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.balance)}
                          </span>
                        </div>
                        <div 
                          className="w-full bg-destructive/80 rounded-t"
                          style={{ 
                            height: `${Math.min(100, (Math.abs(summary.expenses) / 30000) * 100)}%`
                          }}
                        ></div>
                        <div 
                          className="w-full bg-success/80 rounded-t"
                          style={{ 
                            height: `${Math.min(100, (summary.income / 45000) * 100)}%`
                          }}
                        ></div>
                        <span className="text-xs text-center text-muted-foreground">
                          {format(summary.month, 'MMM', { locale: ptBR })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded bg-success mr-2"></div>
                      <span className="text-xs">Receitas</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded bg-destructive mr-2"></div>
                      <span className="text-xs">Despesas</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Distribuição por Categoria
                </CardTitle>
                <CardDescription>Principais categorias no mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Receitas por Categoria</h4>
                    <div className="space-y-3">
                      {incomeByCategory.slice(0, 3).map((category) => (
                        <div key={category.id} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">{category.name}</span>
                              <span className="text-sm font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.total)}
                              </span>
                            </div>
                            <Progress 
                              value={(category.total / totalIncome) * 100}
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Despesas por Categoria</h4>
                    <div className="space-y-3">
                      {expensesByCategory.slice(0, 3).map((category) => (
                        <div key={category.id} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">{category.name}</span>
                              <span className="text-sm font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.total)}
                              </span>
                            </div>
                            <Progress 
                              value={(category.total / Math.abs(totalExpenses)) * 100}
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Próximas Transações</CardTitle>
                  <CardDescription>Receitas e despesas previstas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {transactions
                  .filter(t => t.status === 'pending')
                  .slice(0, 5)
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${transaction.type === 'income' ? 'bg-success' : 'bg-destructive'}`}></div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground space-x-2">
                            <span className="capitalize">{format(transaction.date, 'dd MMM', { locale: ptBR })}</span>
                            <span>•</span>
                            <span>{transaction.category.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-medium ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(transaction.amount))}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">Pendente</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transações</CardTitle>
                  <CardDescription>
                    {format(startOfMonth(selectedMonth), "dd/MM/yyyy")} até {format(endOfMonth(selectedMonth), "dd/MM/yyyy")}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Exibir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="income">Receitas</SelectItem>
                      <SelectItem value="expense">Despesas</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {transactions.slice(0, 15).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-muted/25 px-2 rounded-sm">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${transaction.type === 'income' ? 'bg-success' : 'bg-destructive'}`}></div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground space-x-2">
                          <span className="capitalize">{format(transaction.date, 'dd MMM', { locale: ptBR })}</span>
                          <span>•</span>
                          <span>{transaction.category.name}</span>
                          <span>•</span>
                          <span>{transaction.account.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium ${transaction.amount > 0 ? 'text-success' : 'text-destructive'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(transaction.amount))}
                      </span>
                      {transaction.status === 'pending' && (
                        <Badge variant="outline" className="ml-2 text-xs">Pendente</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button variant="outline">Carregar mais</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas por Categoria</CardTitle>
                <CardDescription>Distribuição de receitas no período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {incomeByCategory.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.total)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Progress 
                          value={(category.total / totalIncome) * 100}
                          className="flex-1 h-2"
                        />
                        <span className="ml-2 text-xs text-muted-foreground">
                          {Math.round((category.total / totalIncome) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição de despesas no período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {expensesByCategory.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.total)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Progress 
                          value={(category.total / Math.abs(totalExpenses)) * 100}
                          className="flex-1 h-2"
                        />
                        <span className="ml-2 text-xs text-muted-foreground">
                          {Math.round((category.total / Math.abs(totalExpenses)) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Previsão Financeira</CardTitle>
                    <CardDescription>Projeção para os próximos 3 meses</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Simular Cenários
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((monthOffset) => {
                      const forecastMonth = addMonths(new Date(), monthOffset);
                      const forecastIncome = Math.round(totalIncome * (1 + (Math.random() * 0.15)));
                      const forecastExpenses = Math.round(totalExpenses * (1 + (Math.random() * 0.1)));
                      const forecastBalance = forecastIncome + forecastExpenses;
                      
                      return (
                        <div key={monthOffset} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium capitalize">
                              {format(forecastMonth, 'LLLL yyyy', { locale: ptBR })}
                            </h3>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Receitas</span>
                              <span className="text-success">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(forecastIncome)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Despesas</span>
                              <span className="text-destructive">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(forecastExpenses))}
                              </span>
                            </div>
                            <Separator className="my-1" />
                            <div className="flex justify-between font-medium">
                              <span>Saldo</span>
                              <span className={forecastBalance >= 0 ? 'text-primary' : 'text-destructive'}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(forecastBalance)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t">
                            <span className="text-xs text-muted-foreground">
                              {forecastBalance > totalBalance 
                                ? `+${Math.round(((forecastBalance - totalBalance) / Math.abs(totalBalance)) * 100)}% vs. atual`
                                : `${Math.round(((forecastBalance - totalBalance) / Math.abs(totalBalance)) * 100)}% vs. atual`
                              }
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Principais Projeções</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Maior receita prevista</span>
                            <span className="font-medium">Serviços Contábeis</span>
                          </div>
                          <Progress value={75} className="h-1.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Maior despesa prevista</span>
                            <span className="font-medium">Salários</span>
                          </div>
                          <Progress value={65} className="h-1.5" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {['Impostos', 'Software', 'Marketing'].map((category, index) => (
                          <div key={category} className="flex justify-between items-center border rounded p-2">
                            <span className="text-sm">{category}</span>
                            <Badge variant="outline">
                              {index === 0 ? '+12%' : index === 1 ? '+5%' : '-3%'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
