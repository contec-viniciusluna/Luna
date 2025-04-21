
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RECEITAWS_TOKEN = "8c23e612d379851e7db27ff852e8d6df7946bde18fb8d5cc2ba3678edd1b84bf";

export default function ClientRegister() {
  const [document, setDocument] = useState('');
  const [isCNPJ, setIsCNPJ] = useState(false);
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [clientData, setClientData] = useState({
    razaoSocial: '',
    nomeFantasia: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    email: '',
    telefone: ''
  });

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setDocument(value);
    setIsCNPJ(value.length === 14); // 14 dígitos para CNPJ
    // Limpar os campos se alterou entre CPF e CNPJ
    setClientData({
      razaoSocial: '',
      nomeFantasia: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      email: '',
      telefone: ''
    });
  };

  const fetchCNPJData = async () => {
    setLoadingCNPJ(true);
    try {
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${document}`, {
        headers: {
          Authorization: `Bearer ${RECEITAWS_TOKEN}`
        }
      });
      const data = await response.json();
      if (data.status === 'OK') {
        setClientData({
          razaoSocial: data.nome || '',
          nomeFantasia: data.fantasia || '',
          endereco: [data.logradouro, data.numero].filter(Boolean).join(', ').trim(),
          cidade: data.municipio || '',
          estado: data.uf || '',
          cep: data.cep || '',
          email: data.email || '',
          telefone: data.telefone || ''
        });
      } else {
        alert('CNPJ não encontrado ou inválido. Verifique e tente novamente.');
      }
    } catch (error) {
      alert('Erro ao buscar dados do CNPJ.');
    }
    setLoadingCNPJ(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode enviar os dados para o backend ou API.
    console.log('Dados do cliente:', { document, ...clientData });
    alert('Cliente cadastrado com sucesso!');
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Clientes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Novo Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="document">CNPJ/CPF</Label>
              <div className="flex space-x-2">
                <Input
                  id="document"
                  value={document}
                  onChange={handleDocumentChange}
                  placeholder="Digite o CNPJ ou CPF"
                  maxLength={14}
                  required
                />
                {isCNPJ && (
                  <Button type="button" onClick={fetchCNPJData} disabled={loadingCNPJ}>
                    {loadingCNPJ ? "Buscando..." : "Buscar CNPJ"}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="razaoSocial">{isCNPJ ? 'Razão Social' : 'Nome Completo'}</Label>
              <Input
                id="razaoSocial"
                value={clientData.razaoSocial}
                onChange={(e) => setClientData({ ...clientData, razaoSocial: e.target.value })}
                placeholder={isCNPJ ? 'Razão Social' : 'Nome Completo'}
                required
              />
            </div>

            {isCNPJ && (
              <div>
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  value={clientData.nomeFantasia}
                  onChange={(e) => setClientData({ ...clientData, nomeFantasia: e.target.value })}
                  placeholder="Nome Fantasia"
                />
              </div>
            )}

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={clientData.endereco}
                onChange={(e) => setClientData({ ...clientData, endereco: e.target.value })}
                placeholder="Endereço"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={clientData.cidade}
                  onChange={(e) => setClientData({ ...clientData, cidade: e.target.value })}
                  placeholder="Cidade"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={clientData.estado}
                  onChange={(e) => setClientData({ ...clientData, estado: e.target.value })}
                  placeholder="Estado"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={clientData.cep}
                onChange={(e) => setClientData({ ...clientData, cep: e.target.value })}
                placeholder="CEP"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                placeholder="Email"
                type="email"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={clientData.telefone}
                onChange={(e) => setClientData({ ...clientData, telefone: e.target.value })}
                placeholder="Telefone"
              />
            </div>

            <Button type="submit">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
