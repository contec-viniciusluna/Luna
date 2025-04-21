import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

export default function CadastroCliente() {
  const [form, setForm] = useState({
    documento: '',
    razao_social: '',
    nome_fantasia: '',
    cnae: '',
    cep: '',
    cidade: '',
    uf: '',
    telefone: '',
    email: ''
  });

  const buscarCNPJ = async () => {
    const cnpj = form.documento.replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    try {
      const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}?token=8c23e612d379851e7db27ff852e8d6df7946bde18fb8d5cc2ba3678edd1b84bf`);
      const data = response.data;
      setForm((prev) => ({
        ...prev,
        razao_social: data.nome,
        nome_fantasia: data.fantasia,
        cnae: data.atividade_principal?.[0]?.code || '',
        cep: data.cep,
        cidade: data.municipio,
        uf: data.uf,
        telefone: data.telefone,
        email: data.email
      }));
    } catch (error) {
      alert('Erro ao buscar dados do CNPJ');
      console.error(error);
    }
  };

  const salvar = async () => {
    const { error } = await supabase.from('clientes').insert([{ ...form }]);
    if (error) {
      alert('Erro ao salvar cliente');
      console.error(error);
    } else {
      alert('Cliente salvo com sucesso!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800/80 backdrop-blur-md p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-white mb-4">Cadastro de Cliente</h2>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            className="w-full border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
            value={form.documento}
            onChange={(e) => setForm({ ...form, documento: e.target.value })}
            placeholder="Digite o CPF ou CNPJ"
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={buscarCNPJ}
          >
            Buscar CNPJ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Razão Social"
          value={form.razao_social}
          onChange={(e) => setForm({ ...form, razao_social: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="Nome Fantasia"
          value={form.nome_fantasia}
          onChange={(e) => setForm({ ...form, nome_fantasia: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="CNAE"
          value={form.cnae}
          onChange={(e) => setForm({ ...form, cnae: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="CEP"
          value={form.cep}
          onChange={(e) => setForm({ ...form, cep: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="Cidade"
          value={form.cidade}
          onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="UF"
          value={form.uf}
          onChange={(e) => setForm({ ...form, uf: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border rounded p-2 bg-zinc-700 text-white placeholder-zinc-300"
        />
      </div>

      <button
        onClick={salvar}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Salvar Cliente
      </button>
    </div>
  );
}
