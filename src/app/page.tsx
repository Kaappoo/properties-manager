'use client';

import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc/client';
import { type Property } from '@/services/propertyService';

type PropertyType = Property['type'];
import {
  Search,
  Plus,
  Building,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  Filter,
  MapPin,
  Bed,
  Maximize,
  Edit,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { data: properties = [], isLoading: loading } = trpc.property.list.useQuery();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | PropertyType>('Todos');

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!prop.title.toLowerCase().includes(query) && !prop.address.toLowerCase().includes(query)) return false;
      }
      if (typeFilter !== 'Todos' && prop.type !== typeFilter) return false;
      return true;
    });
  }, [properties, searchQuery, typeFilter]);

  const stats = [
    { label: 'Total de Imóveis', value: properties.length, icon: Building, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Valor em Carteira', value: `R$ ${(properties.reduce((acc, p) => acc + p.price, 0) / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Ativos p/ Venda', value: properties.filter(p => p.type === 'Venda').length, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Atualizado Hoje', value: new Date().toLocaleDateString(), icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="p-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard de Gestão</h1>
          <p className="text-white/40 text-sm">Bem-vindo ao painel interno da Lumina. Monitore e gerencie seu inventário.</p>
        </div>
        <Link href="/cadastro" className={buttonVariants({ className: 'shadow-[0_0_20px_rgba(14,165,233,0.2)]' })}>
          <Plus className="w-5 h-5 mr-2" />
          Cadastrar Imóvel
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-white/40 font-medium mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-white/5 bg-white/[0.02] overflow-hidden">
        <CardHeader className="p-0">
          {/* Filters Bar */}
          <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
              <Input
                placeholder="Pesquisar título, endereço ou código..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-11"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                {['Todos', 'Venda', 'Aluguel'].map(t => (
                  <Button
                    key={t}
                    variant={typeFilter === t ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTypeFilter(t as any)}
                    className="h-8 text-xs px-4 rounded-md"
                  >
                    {t}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="icon" className="border-white/5 bg-white/5">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Table Area */}
        <div className="relative">
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-[40%]">Imóvel</TableHead>
                <TableHead>Construtora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Características</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.map((prop: any) => (
                  <TableRow key={prop.id} className="border-white/5 hover:bg-white/[0.02] group transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={prop.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{prop.title}</p>
                          <p className="text-xs text-white/30 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {prop.address}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-medium text-white/60">{prop.companyName || '---'}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={prop.type === 'Venda' ? 'default' : 'secondary'} className="uppercase text-[10px] tracking-wider">
                        {prop.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-bold text-white">R$ {(prop.price).toLocaleString('pt-BR')}</p>
                      {prop.type === 'Aluguel' && <p className="text-[10px] text-white/30">por mês</p>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-white/40">
                        <span className="flex items-center gap-1 text-xs"><Bed className="w-3 h-3" /> {prop.bedrooms}</span>
                        <span className="flex items-center gap-1 text-xs"><Maximize className="w-3 h-3" /> {prop.area}m²</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/property/${prop.id}`} className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'h-8 w-8' })}>
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/cadastro/${prop.id}`} className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'h-8 w-8' })}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-white/20 italic">
                    Nenhum imóvel encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
