'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { BuildingIcon, Save, Plus, X, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
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
          <div className="glass-card p-12 text-center border-emerald-500/30">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-2">Imóvel Atualizado com Sucesso!</h2>
            <p className="text-white/60">Você está sendo redirecionado...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 border-white/5 space-y-8">
            
            <div>
              <h3 className="text-xl font-medium mb-6 pb-2 border-b border-white/10">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/70">Título do Imóvel</label>
                  <input 
                    required 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Tipo de Negócio</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as 'Venda'|'Aluguel'})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="Venda" className="bg-[#111]">Venda</option>
                    <option value="Aluguel" className="bg-[#111]">Aluguel</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Preço (R$)</label>
                  <input 
                    required 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/70">Endereço Completo</label>
                  <input 
                    required 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-6 pb-2 border-b border-white/10">Características</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Quartos</label>
                  <input 
                    required 
                    value={formData.bedrooms}
                    onChange={e => setFormData({...formData, bedrooms: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Banheiros</label>
                  <input 
                    required 
                    value={formData.bathrooms}
                    onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Vagas</label>
                  <input 
                    required 
                    value={formData.parkingSpots}
                    onChange={e => setFormData({...formData, parkingSpots: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Área (m²)</label>
                  <input 
                    required 
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-6 pb-2 border-b border-white/10">Detalhes Adicionais</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Descrição Geral</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={5}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-white/70">Destaques e Comodidades</label>
                  <div className="flex gap-2">
                    <input 
                      value={newHighlight}
                      onChange={e => setNewHighlight(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addHighlight();
                        }
                      }}
                      type="text" 
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Ex: Piscina Aquecida"
                    />
                    <button 
                      type="button"
                      onClick={addHighlight}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all"
                    >
                      <Plus className="w-5 h-5 text-primary" />
                    </button>
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
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={updateProperty.isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProperty.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
