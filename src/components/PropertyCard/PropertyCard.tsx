import Link from 'next/link';
import { Bed, Bath, CarFront, Maximize, MapPin, User } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  area: number;
  address: string;
  image: string;
  addedBy?: string | null;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(property.price);

  return (
    <Link href={`/property/${property.id}`} className="block group cursor-pointer focus:outline-none">
      <div className="glass-card overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-white/20 flex flex-col md:flex-row h-auto md:h-48 border border-white/5">
        
        {/* Image Section - Left */}
        <div className="relative w-full md:w-64 h-48 md:h-full shrink-0">
          <div className="absolute top-3 left-3 z-10 text-[10px]">
            <span className={`px-2 py-1 rounded-md font-semibold backdrop-blur-md border border-white/20 ${property.type === 'Venda' ? 'bg-primary/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
              {property.type}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 z-10 text-xs text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            ID: {property.id}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content Section - Right */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{property.title}</h3>
              <p className="text-white/50 text-sm mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {property.address}
              </p>
              {property.addedBy && (
                <div className="mt-2 text-[10px] text-primary/70 font-medium flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full w-fit">
                  <User className="w-2.5 h-2.5" />
                  Corretor: {property.addedBy}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white whitespace-nowrap">{formattedPrice}</div>
              {property.type === 'Aluguel' && <div className="text-xs text-white/50">/mês</div>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2" title="Quartos">
              <Bed className="w-4 h-4 text-white/40" />
              <span>{property.bedrooms} Quartos</span>
            </div>
            <div className="flex items-center gap-2" title="Banheiros">
              <Bath className="w-4 h-4 text-white/40" />
              <span>{property.bathrooms} Banheiros</span>
            </div>
            <div className="flex items-center gap-2" title="Vagas de Garagem">
              <CarFront className="w-4 h-4 text-white/40" />
              <span>{property.parkingSpots} Vagas</span>
            </div>
            <div className="flex items-center gap-2" title="Área (m²)">
              <Maximize className="w-4 h-4 text-white/40" />
              <span>{property.area}m²</span>
            </div>
          </div>
        </div>
        
      </div>
    </Link>
  );
}
