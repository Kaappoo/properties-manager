'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { BuildingIcon, Save } from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const createProperty = trpc.property.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
    },
  });

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
    image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800&auto=format&fit=crop&q=80' // default generic image
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createProperty.mutate({
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
    });
  };

  return (
    <div className="min-h-screen py-24 pb-32 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BuildingIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Adicionar Novo Imóvel</h1>
          <p className="text-lg text-white/50">
            Cadastre um novo produto no catálogo. As informações estarão disponíveis para todos os corretores.
          </p>
        </div>

        {success ? (
          <div className="glass-card p-12 text-center border-emerald-500/30">
            <h2 className="text-2xl font-semibold text-emerald-400 mb-2">Imóvel Cadastrado com Sucesso!</h2>
            <p className="text-white/60">Você está sendo redirecionado para o catálogo...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 border-white/5 space-y-8">
            
            {/* Informações Principais */}
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
                    placeholder="Ex: Cobertura Duplex no Itaim"
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
                    placeholder="Ex: 5000000"
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
                    placeholder="Av. Faria Lima, 1000 - Itaim Bibi, São Paulo"
                  />
                </div>
              </div>
            </div>

            {/* Características */}
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Banheiros</label>
                  <input 
                    required 
                    value={formData.bathrooms}
                    onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Vagas</label>
                  <input 
                    required 
                    value={formData.parkingSpots}
                    onChange={e => setFormData({...formData, parkingSpots: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Área (m²)</label>
                  <input 
                    required 
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h3 className="text-xl font-medium mb-6 pb-2 border-b border-white/10">Detalhes Adicionais</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Descrição Geral</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Detalhe os principais diferenciais do imóvel..."
                />
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={createProperty.isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createProperty.isPending ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publicar Imóvel
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
