'use client';

import { useEffect, useState, useMemo } from 'react';
import PropertyCard from '@/components/PropertyCard/PropertyCard';
import { trpc } from '@/lib/trpc/client';
import { PropertyType } from '@/services/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const { data: properties = [], isLoading: loading } = trpc.property.list.useQuery();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | PropertyType>('Todos');
  const [minBedrooms, setMinBedrooms] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !prop.title.toLowerCase().includes(query) &&
          !prop.address.toLowerCase().includes(query) &&
          !prop.id.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Type
      if (typeFilter !== 'Todos' && prop.type !== typeFilter) return false;

      // Bedrooms
      if (minBedrooms !== '' && prop.bedrooms < Number(minBedrooms)) return false;

      // Price
      if (maxPrice !== '' && prop.price > Number(maxPrice)) return false;

      return true;
    });
  }, [properties, searchQuery, typeFilter, minBedrooms, maxPrice]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar / Filters */}
          <aside className="w-full md:w-72 shrink-0">
            <div className="glass-card p-6 border-white/5 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-white">Filtros</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-white/50">Tipo de Negócio</label>
                  <div className="flex gap-2">
                    {['Todos', 'Venda', 'Aluguel'].map(type => (
                      <button
                        key={type}
                        onClick={() => setTypeFilter(type as any)}
                        className={`flex-1 py-1.5 text-xs rounded-md transition-colors border ${typeFilter === type
                          ? 'bg-primary/20 border-primary/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/50">Quartos Mínimos</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 2"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/50">Preço Máximo (R$)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 1000000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <button
                  onClick={() => {
                    setTypeFilter('Todos');
                    setMinBedrooms('');
                    setMaxPrice('');
                    setSearchQuery('');
                  }}
                  className="w-full text-xs text-white/40 hover:text-white transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Main List Area */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Catálogo Interno</h1>
              <p className="text-white/50 text-sm">Gerencie o acervo de propriedades disponíveis.</p>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Pesquisar por endereço, título ou ID do imóvel..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>

            <div className="flex items-center justify-between mb-4 text-sm text-white/50">
              <span>Exibindo {loading ? '...' : filteredProperties.length} propriedades</span>
            </div>

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="py-20 text-center">
                  <span className="inline-block w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin"></span>
                </div>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="glass-card py-16 text-center border-white/5">
                  <Search className="w-10 h-10 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50 font-medium">Nenhum imóvel encontrado.</p>
                  <p className="text-sm text-white/30 mt-1">Tente ajustar seus filtros de busca.</p>
                </div>
              )}
            </div>
          </main>

        </div>

      </div>
    </div>
  );
}
