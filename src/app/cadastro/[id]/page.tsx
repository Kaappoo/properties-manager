'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { BuildingIcon, Save, Plus, X, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  
  const { data: companies = [] } = trpc.company.list.useQuery();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Venda' as 'Venda' | 'Aluguel',
    price: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpots: '',
    area: '',
    address: '',
    image: '',
    condition: 'Novo' as 'Novo' | 'Seminovo',
    companyId: '',
    highlights: [] as string[]
  });

  const { data: property, isLoading } = trpc.property.getById.useQuery({ id });
  const updateProperty = trpc.property.update.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/property/${id}`);
        router.refresh();
      }, 2000);
    },
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        type: property.type as any,
        price: property.price.toString(),
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        parkingSpots: property.parkingSpots.toString(),
        area: property.area.toString(),
        address: property.address,
        image: property.image,
        condition: (property as any).condition || 'Novo',
        companyId: property.companyId || '',
        highlights: property.highlights || [],
      });
    }
  }, [property]);

  const [newHighlight, setNewHighlight] = useState('');

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, newHighlight.trim()]
      });
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateProperty.mutate({
      id,
      data: {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        parkingSpots: Number(formData.parkingSpots),
        area: Number(formData.area),
        address: formData.address,
        image: formData.image,
        condition: formData.condition,
        companyId: formData.companyId || undefined,
        highlights: formData.highlights,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>
        <Link href="/" className="text-primary hover:underline">Voltar para o início</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 pb-32 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12">
          <Link href={`/property/${id}`} className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar para detalhes
          </Link>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BuildingIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Editar Imóvel</h1>
            <p className="text-lg text-white/50">
              Atualize as informações do imóvel no catálogo.
            </p>
          </div>
        </div>

        {success ? (
          <Card className="border-emerald-500/30 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-semibold text-emerald-400 mb-2">Imóvel Atualizado com Sucesso!</h2>
              <p className="text-white/60">Você está sendo redirecionado...</p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-medium">Informações Básicas</CardTitle>
                <CardDescription>Insira os detalhes principais do imóvel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Título do Imóvel</Label>
                    <Input 
                      id="title"
                      required 
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Cobertura Duplex no Itaim"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Construtora Responsável</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.companyId || null}
                        onValueChange={value => setFormData({ ...formData, companyId: value ?? "" })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione uma construtora (opcional)">
                            {formData.companyId ? companies.find(c => c.id === formData.companyId)?.name : null}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map(company => (
                            <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.companyId && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, companyId: "" })}
                          className="shrink-0 border-white/5 bg-black/40 hover:bg-white/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de Negócio</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={value => setFormData({...formData, type: value as 'Venda' | 'Aluguel'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venda">Venda</SelectItem>
                        <SelectItem value="Aluguel">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado do Imóvel</Label>
                    <Select 
                      value={formData.condition} 
                      onValueChange={value => setFormData({...formData, condition: value as 'Novo' | 'Seminovo'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Seminovo">Seminovo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input 
                      id="price"
                      required 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      type="number" 
                      placeholder="Ex: 5000000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input 
                      id="address"
                      required 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="Av. Faria Lima, 1000 - Itaim Bibi, São Paulo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-medium">Características</CardTitle>
                <CardDescription>Detalhes técnicos do imóvel.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input 
                      id="bedrooms"
                      required 
                      value={formData.bedrooms}
                      onChange={e => setFormData({...formData, bedrooms: e.target.value})}
                      type="number" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input 
                      id="bathrooms"
                      required 
                      value={formData.bathrooms}
                      onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                      type="number" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parking">Vagas</Label>
                    <Input 
                      id="parking"
                      required 
                      value={formData.parkingSpots}
                      onChange={e => setFormData({...formData, parkingSpots: e.target.value})}
                      type="number" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input 
                      id="area"
                      required 
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                      type="number" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl font-medium">Detalhes Adicionais</CardTitle>
                <CardDescription>Descrição e destaques do imóvel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Geral</Label>
                  <Textarea 
                    id="description"
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={5}
                    placeholder="Detalhe os principais diferenciais do imóvel..."
                    className="resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Destaques e Comodidades</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={newHighlight}
                      onChange={e => setNewHighlight(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addHighlight();
                        }
                      }}
                      placeholder="Ex: Piscina Aquecida"
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={addHighlight}
                    >
                      <Plus className="w-5 h-5 text-primary" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.highlights.map((highlight, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-light px-3 py-1.5 rounded-full text-sm"
                      >
                        {highlight}
                        <button 
                          type="button" 
                          onClick={() => removeHighlight(index)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {formData.highlights.length === 0 && (
                      <p className="text-xs text-white/30 italic">Nenhum destaque adicionado ainda.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={updateProperty.isPending}
                className="w-full shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
              >
                {updateProperty.isPending ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
