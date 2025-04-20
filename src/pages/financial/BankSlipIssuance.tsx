
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { 
  Calendar, Check, ChevronsUpDown, 
  FileText, Send, Download, Eye, 
  CreditCard, Copy, DollarSign, BanknoteIcon 
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
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Sample data
const clients = [
  { value: "abc-ltda", label: "Empresa ABC Ltda", cnpj: "12.345.678/0001-90", address: "Av. Principal, 1000" },
  { value: "xyz-comercio", label: "XYZ Comércio S.A.", cnpj: "98.765.432/0001-10", address: "Rua do Comércio, 500" },
  { value: "tech-solutions", label: "Tech Solutions", cnpj: "11.222.333/0001-44", address: "Av. Tecnologia, 200" },
  { value: "consultoria-123", label: "Consultoria 123", cnpj: "44.555.666/0001-77", address: "Rua dos Consultores, 300" },
];

const banks = [
  { value: "itau", label: "Itaú Unibanco" },
  { value: "bradesco", label: "Bradesco" },
  { value: "bb", label: "Banco do Brasil" },
  { value: "santander", label: "Santander" },
  { value: "caixa", label: "Caixa Econômica Federal" },
];

const formSchema = z.object({
  client: z.string({
    required_error: "Por favor selecione um cliente.",
  }),
  bank: z.string({
    required_error: "Por favor selecione um banco.",
  }),
  amount: z.string().min(1, "O valor é obrigatório"),
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres"),
  dueDate: z.date({
    required_error: "A data de vencimento é obrigatória.",
  }),
  instructions: z.string().optional(),
  discount: z.string().optional(),
  discountUntil: z.date().optional(),
  interest: z.string().optional(),
  sendEmail: z.boolean().default(true),
  documentType: z.enum(["invoice", "contract", "other"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function BankSlipIssuance() {
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [activeTab, setActiveTab] = useState("info");

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      instructions: "",
      discount: "",
      interest: "2",
      sendEmail: true,
      documentType: "invoice",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send this to your API
    alert("Boleto gerado com sucesso!");
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
          <h1 className="text-2xl font-bold text-foreground">Emissão de Boleto</h1>
          <p className="text-muted-foreground">Preencha os dados para gerar um boleto bancário</p>
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
            Gerar Boleto
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações Básicas</TabsTrigger>
          <TabsTrigger value="options">Opções Adicionais</TabsTrigger>
          <TabsTrigger value="preview">Visualização e Envio</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Cliente e Boleto</CardTitle>
                  <CardDescription>Informe os dados básicos do boleto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
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

                    <FormField
                      control={form.control}
                      name="bank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o banco" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {banks.map((bank) => (
                                <SelectItem key={bank.value} value={bank.value}>
                                  {bank.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor do Boleto</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                R$
                              </span>
                              <Input 
                                className="pl-10" 
                                placeholder="0,00" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Use vírgula como separador decimal
                          </FormDescription>
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
                          <FormDescription>
                            Data limite para pagamento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Boleto</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Pagamento referente à fatura #1234" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Esta descrição aparecerá no boleto
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Tipo de Documento</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="invoice" id="invoice" />
                              </FormControl>
                              <FormLabel htmlFor="invoice" className="font-normal cursor-pointer">
                                Nota Fiscal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="contract" id="contract" />
                              </FormControl>
                              <FormLabel htmlFor="contract" className="font-normal cursor-pointer">
                                Contrato
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" id="other" />
                              </FormControl>
                              <FormLabel htmlFor="other" className="font-normal cursor-pointer">
                                Outro
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={() => setActiveTab("options")}>Próximo</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="options">
              <Card>
                <CardHeader>
                  <CardTitle>Opções Adicionais</CardTitle>
                  <CardDescription>Defina opções de desconto, juros e instruções do boleto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instruções ao Sacado</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Instruções que aparecerão no boleto..."
                                className="resize-none"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Informe instruções adicionais para pagamento
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sendEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enviar por email</FormLabel>
                              <FormDescription>
                                Enviar boleto automaticamente ao gerar
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border rounded-lg p-4 space-y-6">
                      <h3 className="text-sm font-medium">Opções Financeiras</h3>
                      
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desconto para Pagamento Antecipado</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  R$
                                </span>
                                <Input 
                                  className="pl-10" 
                                  placeholder="0,00" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Deixe em branco para não aplicar desconto
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discountUntil"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Desconto válido até</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={!form.getValues("discount")}
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
                        name="interest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Juros por atraso (% ao mês)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  className="pr-10" 
                                  placeholder="2,0" 
                                  {...field} 
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  % a.m.
                                </span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Juros cobrados após o vencimento
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                  <CardDescription>Revise os dados antes de gerar o boleto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-secondary/10 mb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-1">BOLETO BANCÁRIO</h3>
                        <p className="text-sm text-muted-foreground">
                          {form.getValues("bank") ? banks.find(b => b.value === form.getValues("bank"))?.label : "Banco não selecionado"}
                        </p>
                      </div>
                      <Badge className="text-md py-1.5">
                        R$ {form.getValues("amount") || "0,00"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">BENEFICIÁRIO</h4>
                        <p className="font-medium">Seu Escritório Contábil</p>
                        <p className="text-sm text-muted-foreground">CNPJ: 01.234.567/0001-89</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">PAGADOR</h4>
                        <p className="font-medium">{selectedClient?.label || "Cliente não selecionado"}</p>
                        <p className="text-sm text-muted-foreground">CNPJ: {selectedClient?.cnpj || "N/A"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">VENCIMENTO</h4>
                        <p className="font-medium">
                          {form.getValues("dueDate") ? format(form.getValues("dueDate"), "dd/MM/yyyy") : "Não informado"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">VALOR</h4>
                        <p className="font-medium">R$ {form.getValues("amount") || "0,00"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">DOCUMENTO</h4>
                        <p className="font-medium">
                          {form.getValues("documentType") === "invoice" ? "Nota Fiscal" : 
                           form.getValues("documentType") === "contract" ? "Contrato" : "Outro"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">DESCRIÇÃO</h4>
                        <p className="text-sm">{form.getValues("description") || "Não informada"}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">INSTRUÇÕES</h4>
                        <p className="text-sm whitespace-pre-line">{form.getValues("instructions") || "Nenhuma instrução adicional."}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Desconto até {form.getValues("discountUntil") ? format(form.getValues("discountUntil"), "dd/MM/yyyy") : "N/A"}:</span>
                        <span className="text-sm">R$ {form.getValues("discount") || "0,00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Juros após vencimento:</span>
                        <span className="text-sm">{form.getValues("interest") || "0"}% ao mês</span>
                      </div>
                    </div>

                    <div className="mt-6 bg-primary/5 p-4 rounded-md border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BanknoteIcon className="h-5 w-5 text-primary mr-2" />
                          <p className="text-sm font-medium">Código de Barras</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </Button>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground mt-2">
                        12345.67890 12345.678901 12345.678901 1 12345678901234
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                    <Button variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Compartilhar Link
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("options")}>Voltar</Button>
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Gerar e Enviar Boleto
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
