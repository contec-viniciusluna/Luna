import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';

interface Client { id: number; nome: string; }
interface Transaction { id: number; amount: number; type: string; }
interface Obligation { id: number; title: string; due_date: string; status: string; }
interface Task { id: number; title: string; assigned_to: string; }

const Dashboard = () => {
  const [data, setData] = useState<{
    clients: Client[];
    transactions: Transaction[];
    obligations: Obligation[];
    tasks: Task[];
  }>({ clients: [], transactions: [], obligations: [], tasks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const queries = [
          supabase.from('clients').select('id, nome'),
          supabase.from('transactions').select('id, amount, type').limit(5),
          supabase.from('obligations').select('id, title, due_date, status')
            .gte('due_date', startOfWeek.toISOString())
            .lte('due_date', endOfWeek.toISOString())
            .order('due_date'),
          supabase.from('tasks').select('id, title, assigned_to').limit(5),
        ];

        const results = await Promise.all(queries.map(q => q.catch(e => ({ data: null, error: e }))));

        const [clientsRes, transactionsRes, obligationsRes, tasksRes] = results;

        if (clientsRes.error) toast.error('Erro ao carregar clientes');
        if (transactionsRes.error) toast.error('Erro ao carregar transações');
        if (obligationsRes.error) toast.error('Erro ao carregar obrigações');
        if (tasksRes.error) toast.error('Erro ao carregar tarefas');

        setData({
          clients: clientsRes.data || [],
          transactions: transactionsRes.data || [],
          obligations: obligationsRes.data || [],
          tasks: tasksRes.data || [],
        });
      } catch (error) {
        toast.error('Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2"><Users className="h-5 w-5" /> Clientes</CardTitle>
          </CardHeader>
          <CardContent>{loading ? 'Carregando...' : `${data.clients.length} ativos`}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2"><DollarSign className="h-5 w-5" /> Transações</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? 'Carregando...' : data.transactions.length === 0 ? 'Sem dados' : (
              <Table>
                <TableBody>
                  {data.transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.type === 'revenue' ? 'Receita' : 'Despesa'}</TableCell>
                      <TableCell>R$ {t.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2"><Calendar className="h-5 w-5" /> Obrigações da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? 'Carregando...' : data.obligations.length === 0 ? 'Sem obrigações' : (
              <Table>
                <TableBody>
                  {data.obligations.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.title}</TableCell>
                      <TableCell>{new Date(o.due_date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{o.status === 'pending' ? 'Pendente' : 'Concluído'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2"><CheckCircle className="h-5 w-5" /> Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? 'Carregando...' : data.tasks.length === 0 ? 'Sem tarefas' : (
              <Table>
                <TableBody>
                  {data.tasks.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.title}</TableCell>
                      <TableCell>{t.assigned_to}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;