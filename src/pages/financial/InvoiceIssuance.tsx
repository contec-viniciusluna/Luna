
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { 
  Calculator, Calendar, Check, ChevronsUpDown, 
  FileText, Send, Download, Eye, Plus, X 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Sample data for clients and services
const clients = [
  { value: "abc-ltda", label: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90", address: "Av. Principal, 1000" },
  { value: "xyz-comercio", label: "XYZ Comércio S.A.", cnpj: "98.765.432/0001-10", address: "Rua do Comércio, 500" },
  { value: "tech-solutions", label: "Tech Solutions", cnpj: "11.222.333/0001-44", address: "Av. Tecnologia, 200" },
  { value: "consultoria-123", label: "Consultoria 123", cnpj: "44.555.666/0001-77", address: "Rua dos Consultores, 300" },
];

const services = [
  { id: 1, description: "Consultoria Contábil", value: 1500.00, taxRate: 3 },
  { id: 2, description: "Escrituração Fiscal", value: 800.00, taxRate: 2 },
  { id: 3, description: "Folha de Pagamento", value: 1200.00, taxRate: 3 },
  { id: 4, description: "Planejamento Tributário", value: 2500.00, taxRate: 5 },
  { id: 5, description: "Assessoria Empresarial", value: 1800.00, taxRate: 3 },
];

const municipalityOptions = [
  { value: "sao-paulo", label: "São Paulo - SP" },
  { value: "rio-de-janeiro", label: "Rio de Janeiro - RJ" },
  { value: "belo-horizonte", label: "Belo Horizonte - MG" },
  { value: "brasilia", label: "Brasília - DF" },
  { value: "salvador", label: "Salvador - BA" },
];

const formSchema = z.object({
  client: z.string({
    required_error: "Por favor selecione um cliente.",
  }),
  serviceDate: z.date({
    required_error: "A data de serviço é obrigatória.",
  }),
  dueDate: z.date().optional(),
  municipality: z.string({
    required_error: "Por favor selecione o município.",
  }),
  services: z.array(
    z.object({
      id: z.number(),
      description: z.string(),
      value: z.number(),
      quantity: z.number().min(1),
      taxRate: z.number(),
    })
  ).min(1, "Adicione pelo menos um serviço"),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function InvoiceIssuance() {
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [selectedServices, setSelectedServices] = useState<Array<(typeof services[0] & { quantity: number })>>([]);
  const [activeTab, setActiveTab] = useState("info");
  
  // Calculate totals
  const subtotal = selectedServices.reduce((sum, service) => sum + (service.value * service.quantity), 0);
  const taxAmount = selectedServices.reduce((sum, service) => sum + (service.value * service.quantity * service.taxRate / 100), 0);
  const total = subtotal - taxAmount;

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      observations: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send this to your API
    alert("Nota fiscal gerada com sucesso!");
  };

  const addService = (service: typeof services[0]) => {
    const existingIndex = selectedServices.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedServices];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      setSelectedServices(updated);
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
    
    form.setValue("services", [
      ...selectedServices.map(s => ({
        id: s.id,
        description: s.description,
        value: s.value,
        quantity: s.quantity,
        taxRate: s.taxRate
      }))
    ]);
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
    form.setValue("services", form.getValues("services").filter(s => s.id !== serviceId));
  };

  const updateQuantity = (serviceId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedServices(selectedServices.map(service => 
      service.id === serviceId ? { ...service, quantity } : service
    ));
    
    form.setValue("services", selectedServices.map(service => ({
      id: service.id,
      description: service.description,
      value: service.value,
      quantity: service.id === serviceId ? quantity : service.quantity,
      taxRate: service.taxRate
    })));
  };

  const handleClientChange = (value: string) => {
    const client = clients.find(c => c.value === value);
    setSelectedClient(client || null);
    form.setValue("client", value);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emissão de NFS-e</h1>
          <p className="text-muted-foreground">Preencha os dados para emitir uma nota fiscal de serviços eletrônica</p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            <FileText className="h-4 w-4 mr-2" />
            Rascunhos
          </Button>
          <Button variant="outline" className="mr-2">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Emitir NFS-e
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações Básicas</TabsTrigger>
          <TabsTrigger value="services">Serviços e Valores</TabsTrigger>
          <TabsTrigger value="preview">Visualização e Envio</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Cliente e Serviço</CardTitle>
                  <CardDescription>Informe os dados básicos da nota fiscal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Cliente</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? clients.find((client) => client.value === field.value)?.label
                                  : "Selecione um cliente"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar cliente..." />
                              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                              <CommandGroup>
                                {clients.map((client) => (
                                  <CommandItem
                                    key={client.value}
                                    value={client.value}
                                    onSelect={() => handleClientChange(client.value)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        client.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {client.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedClient && (
                    <div className="bg-secondary/50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">CNPJ</Label>
                          <p className="font-medium">{selectedClient.cnpj}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Endereço</Label>
                          <p className="font-medium">{selectedClient.address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="serviceDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Emissão</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              {/* Calendar component would be added here */}
                              <div className="p-4">
                                <p>Calendário aqui</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Data de Vencimento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              {/* Calendar component would be added here */}
                              <div className="p-4">
                                <p>Calendário aqui</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="municipality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Município de Prestação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o município" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {municipalityOptions.map((municipality) => (
                              <SelectItem key={municipality.value} value={municipality.value}>
                                {municipality.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={() => setActiveTab("services")}>Próximo</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Serviços e Valores</CardTitle>
                  <CardDescription>Adicione os serviços prestados e define os valores e impostos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <FormLabel>Adicionar Serviços</FormLabel>
                      <FormDescription>Escolha os serviços prestados</FormDescription>
                    </div>
                    <Select onValueChange={(value) => {
                      const service = services.find(s => s.id === parseInt(value));
                      if (service) addService(service);
                    }}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.description} - R$ {service.value.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Descrição</th>
                          <th className="text-center p-3 font-medium">Valor Unit.</th>
                          <th className="text-center p-3 font-medium">Qtd.</th>
                          <th className="text-center p-3 font-medium">Imposto %</th>
                          <th className="text-right p-3 font-medium">Total</th>
                          <th className="p-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedServices.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-muted-foreground">
                              Nenhum serviço adicionado. Use o seletor acima para adicionar serviços.
                            </td>
                          </tr>
                        ) : (
                          selectedServices.map(service => (
                            <tr key={service.id} className="border-b">
                              <td className="p-3">{service.description}</td>
                              <td className="p-3 text-center">R$ {service.value.toFixed(2)}</td>
                              <td className="p-3 text-center">
                                <div className="flex justify-center">
                                  <div className="flex items-center border rounded-md max-w-24">
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      className="px-2"
                                      onClick={() => updateQuantity(service.id, service.quantity - 1)}
                                    >
                                      -
                                    </Button>
                                    <span className="px-2">{service.quantity}</span>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      className="px-2"
                                      onClick={() => updateQuantity(service.id, service.quantity + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center">{service.taxRate}%</td>
                              <td className="p-3 text-right">R$ {(service.value * service.quantity).toFixed(2)}</td>
                              <td className="p-3 text-center">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeService(service.id)}
                                >
                                  <X className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="observations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Adicione informações complementares sobre o serviço..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <div className="bg-secondary/50 p-4 rounded-md">
                        <div className="space-y-2">
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground">Impostos ({selectedServices.length > 0 ? 'vários' : '0'}%):</span>
                            <span>R$ {taxAmount.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between py-1 font-medium">
                            <span>Total:</span>
                            <span>R$ {total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <Button type="button" variant="outline" className="w-full">
                        <Calculator className="h-4 w-4 mr-2" />
                        Simular Impostos
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("info")}>Voltar</Button>
                  <Button onClick={() => setActiveTab("preview")}>Próximo</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização e Envio</CardTitle>
                  <CardDescription>Revise os dados antes de emitir a NFS-e</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border p-6 rounded-md bg-secondary/20">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-primary">NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</h2>
                      <p className="text-muted-foreground">Nº 0001 - Série NFS-e</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-medium mb-2 text-primary-800">PRESTADOR</h3>
                        <p className="font-medium">Seu Escritório Contábil</p>
                        <p className="text-sm text-muted-foreground">CNPJ: 01.234.567/0001-89</p>
                        <p className="text-sm text-muted-foreground">Rua Exemplo, 123 - Centro</p>
                        <p className="text-sm text-muted-foreground">contato@escritorio.com.br</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 text-primary-800">TOMADOR</h3>
                        <p className="font-medium">{selectedClient?.label || "Cliente não selecionado"}</p>
                        <p className="text-sm text-muted-foreground">CNPJ: {selectedClient?.cnpj || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">{selectedClient?.address || "Endereço não informado"}</p>
                      </div>
                    </div>

                    <h3 className="font-medium mb-2 text-primary-800">SERVIÇOS</h3>
                    <table className="w-full mb-6">
                      <thead>
                        <tr className="border-b border-muted">
                          <th className="text-left p-2 font-medium">Descrição</th>
                          <th className="text-right p-2 font-medium">Valor Unit.</th>
                          <th className="text-right p-2 font-medium">Qtd.</th>
                          <th className="text-right p-2 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedServices.map(service => (
                          <tr key={service.id} className="border-b border-muted">
                            <td className="p-2">{service.description}</td>
                            <td className="p-2 text-right">R$ {service.value.toFixed(2)}</td>
                            <td className="p-2 text-right">{service.quantity}</td>
                            <td className="p-2 text-right">R$ {(service.value * service.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2 text-primary-800">INFORMAÇÕES ADICIONAIS</h3>
                        <p className="text-sm mb-2">
                          {form.getValues("observations") || "Nenhuma observação adicional."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Município de prestação: {municipalityOptions.find(m => m.value === form.getValues("municipality"))?.label || "Não selecionado"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Data de emissão: {form.getValues("serviceDate") ? format(form.getValues("serviceDate"), "dd/MM/yyyy") : "Não informada"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 text-primary-800">VALORES</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">Valor dos Serviços:</span>
                            <span className="text-sm">R$ {subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Desconto:</span>
                            <span className="text-sm">R$ 0,00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Retenções (ISS/PIS/COFINS/IR):</span>
                            <span className="text-sm">R$ {taxAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium mt-2">
                            <span>Valor Total:</span>
                            <span>R$ {total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar Completa
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("services")}>Voltar</Button>
                  <Button type="submit" variant="default">
                    <Send className="h-4 w-4 mr-2" />
                    Emitir NFS-e
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
