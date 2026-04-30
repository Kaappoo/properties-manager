'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { 
  Building, 
  Plus, 
  Globe, 
  Trash2, 
  ExternalLink, 
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ConstrutorasPage() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo: '',
    description: ''
  });

  const { data: companies = [], isLoading, refetch } = trpc.company.list.useQuery();
  const createCompany = trpc.company.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      setFormData({ name: '', website: '', logo: '', description: '' });
      refetch();
    }
  });

  const deleteCompany = trpc.company.delete.useMutation({
    onSuccess: () => refetch()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany.mutate(formData);
  };

  return (
    <div className="p-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Construtoras Parceiras</h1>
          <p className="text-white/40 text-sm">Gerencie as empresas responsáveis pelos empreendimentos.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/10">
              <Plus className="w-5 h-5 mr-2" />
              Nova Construtora
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-neutral-900 border-white/5">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Cadastrar Construtora</DialogTitle>
                <DialogDescription>
                  Adicione uma nova parceira ao sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input 
                    id="name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Cyrela, Mitre, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (URL)</Label>
                    <Input 
                      id="website"
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo (URL)</Label>
                    <Input 
                      id="logo"
                      value={formData.logo}
                      onChange={e => setFormData({...formData, logo: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Curta</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    placeholder="Fale um pouco sobre a construtora..."
                    className="resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createCompany.isPending} className="w-full">
                  {createCompany.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Salvar Construtora'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : companies.length > 0 ? (
          companies.map((company) => (
            <Card key={company.id} className="bg-white/[0.02] border-white/5 group hover:bg-white/[0.04] transition-all relative">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building className="w-8 h-8 text-white/20" />
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 text-white/30 hover:text-red-400"
                  onClick={() => {
                    if (confirm('Excluir esta construtora?')) deleteCompany.mutate({ id: company.id });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight">{company.name}</h3>
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-xs font-medium flex items-center gap-1 hover:underline pb-2"
                  >
                    <Globe className="w-3 h-3" />
                    Website Oficial
                    <ExternalLink className="w-2 h-2" />
                  </a>
                )}
                <p className="text-sm text-white/40 line-clamp-2 min-h-[2.5rem]">
                  {company.description || 'Nenhuma descrição fornecida.'}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Ativos</span>
                <span className="text-sm font-bold text-white/60">--</span>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
            <Building className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-medium">Nenhuma construtora cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
