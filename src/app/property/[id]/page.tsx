import { propertyService } from '@/services/propertyService';
import { Bed, Bath, CarFront, Maximize, MapPin, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    <div className="min-h-screen pb-32">
      {/* Imagem de Fundo (Blur) e Capa */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 bg-gradient-to-t from-background to-transparent pt-32">
          <div className="container mx-auto">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/20 ${property.type === 'Venda' ? 'bg-primary/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
              Para {property.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 line-clamp-2">{property.title}</h1>
            <div className="flex items-center text-white/70 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {property.address}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-12 relative z-20">
        <div className="lg:col-span-2 space-y-12">
          
          <section className="glass-card p-8 border-white/5">
            <h2 className="text-2xl font-semibold mb-6">Visão Geral</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <Bed className="w-8 h-8 text-primary mb-3" />
                <span className="text-2xl font-bold">{property.bedrooms}</span>
                <span className="text-white/50 text-sm">Quartos</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <Bath className="w-8 h-8 text-primary mb-3" />
                <span className="text-2xl font-bold">{property.bathrooms}</span>
                <span className="text-white/50 text-sm">Banheiros</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <CarFront className="w-8 h-8 text-primary mb-3" />
                <span className="text-2xl font-bold">{property.parkingSpots}</span>
                <span className="text-white/50 text-sm">Vagas</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <Maximize className="w-8 h-8 text-primary mb-3" />
                <span className="text-2xl font-bold">{property.area}</span>
                <span className="text-white/50 text-sm">Metros (m²)</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Descrição do Imóvel</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {property.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Destaques</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Design Contemporâneo', 'Automação Residencial', 
                'Fechadura Biométrica', 'Ar condicionado Central',
                'Pé direito duplo', 'Condomínio Clube'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center text-white/80">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-28 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg text-white/60 mb-2">Valor Total</h3>
            <div className="text-4xl font-bold text-gradient mb-6 pb-6 border-b border-white/10">
              {formattedPrice} {property.type === 'Aluguel' && <span className="text-base text-white/50 font-normal">/mês</span>}
            </div>

            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 rounded-xl transition-all mb-4 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
              Agendar Visita
            </button>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-xl transition-all border border-white/10">
              Falar com o Corretor
            </button>

            <p className="text-center text-xs text-white/40 mt-6">
              Código do Imóvel: {property.id.toUpperCase()}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
