import { propertyService } from '@/services/propertyService';
import { Bed, Bath, CarFront, Maximize, MapPin, CheckCircle, Calendar, Hash, ArrowLeft, Building, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BrokerActions from './BrokerActions';

export default async function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await propertyService.getPropertyById(id);

  if (!property) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(property.price);

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto">
      {/* Breadcrumbs / Actions Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm">
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Listagem
        </Link>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${property.type === 'Venda' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'}`}>
            {property.type}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
            ID: {property.id.slice(0, 8)}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Visuals & Main Info */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Image */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden aspect-[16/9] relative group">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Title & Stats Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{property.title}</h1>
            <p className="text-white/40 flex items-center gap-2 mb-8 text-lg">
              <MapPin className="w-5 h-5" />
              {property.address}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Quartos', value: property.bedrooms },
                { icon: Bath, label: 'Banheiros', value: property.bathrooms },
                { icon: CarFront, label: 'Vagas', value: property.parkingSpots },
                { icon: Maximize, label: 'Área', value: `${property.area}m²` },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center">
                  <stat.icon className="w-5 h-5 text-primary mb-2" />
                  <span className="text-lg font-bold text-white">{stat.value}</span>
                  <span className="text-[10px] text-white/30 uppercase font-semibold">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              Descrição do Imóvel
            </h2>
            <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          {/* Highlights Section */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-400 rounded-full" />
              Destaques e Comodidades
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.highlights && property.highlights.length > 0 ? (
                property.highlights.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-white/20 italic text-sm col-span-full">Nenhum destaque cadastrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Financials & Admin */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sticky top-8 shadow-2xl">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Valor de Mercado</p>
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">
              {formattedPrice}
            </div>
            {property.type === 'Aluguel' && <p className="text-sm text-white/30 mb-6">valor mensal total</p>}
            
            <div className="space-y-3 mt-8">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/10">
                Gerar Relatório PDF
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-2xl border border-white/10 transition-all">
                Enviar p/ Cliente
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              {property.company && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-3">Construtora Parceira</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                      {property.company.logo ? (
                        <img src={property.company.logo} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <Building className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{property.company.name}</p>
                      {property.company.website && (
                        <a href={property.company.website} target="_blank" rel="noopener" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                          Website Oficial <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Data de Cadastro</span>
                <span className="text-white/60 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30 flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Código Interno</span>
                <span className="text-white/60 font-mono">{property.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>

            <div className="mt-8">
              <BrokerActions propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
