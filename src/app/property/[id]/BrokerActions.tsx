'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Edit, Trash2, Loader2, BadgeCheck, PowerOff } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BrokerActionsProps {
  propertyId: string;
  isSold?: boolean;
}

export default function BrokerActions({ propertyId, isSold }: BrokerActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const utils = trpc.useUtils();

  const deleteProperty = trpc.property.delete.useMutation({
    onSuccess: () => {
      utils.property.list.invalidate();
      router.push('/');
      router.refresh();
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const handleDelete = async () => {
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    deleteProperty.mutate({ id: propertyId });
  };

  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const updateProperty = trpc.property.update.useMutation({
    onSuccess: async () => {
      await utils.property.list.refetch();
      await utils.property.getById.refetch({ id: propertyId });
      router.refresh();
      setIsSellOpen(false);
      setIsDeactivateOpen(false);
      router.push('/');
    },
    onError: (err) => {
      alert("Erro ao atualizar imóvel: " + err.message);
      console.error(err);
    }
  });

  const handleSell = () => {
    updateProperty.mutate({ id: propertyId, data: { soldAt: new Date() } });
  };

  const handleDeactivate = () => {
    updateProperty.mutate({ id: propertyId, data: { deactivatedAt: new Date() } });
  };

  return (
    <div className="pt-8 border-t border-white/10">
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Painel do Corretor</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Link 
          href={`/cadastro/${propertyId}`}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg border border-white/10 transition-all text-sm"
        >
          <Edit className="w-4 h-4" />
          Editar
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-lg border border-red-500/20 transition-all text-sm disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Excluir
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {!isSold && (
          <button 
            onClick={() => setIsSellOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-3 rounded-lg border border-emerald-500/20 transition-all text-sm"
          >
            <BadgeCheck className="w-4 h-4" />
            Marcar como Vendido
          </button>
        )}
        <button 
          onClick={() => setIsDeactivateOpen(true)}
          className="flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 py-3 rounded-lg border border-orange-500/20 transition-all text-sm"
        >
          <PowerOff className="w-4 h-4" />
          Desativar Imóvel
        </button>
      </div>

      {/* Modal Vendido */}
      <Dialog open={isSellOpen} onOpenChange={setIsSellOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-bottom-10 duration-300">
          <DialogHeader>
            <DialogTitle>Marcar imóvel como vendido?</DialogTitle>
            <DialogDescription className="text-white/60">
              Isso atualizará o imóvel com a data de hoje. Ele não aparecerá mais nos resultados de busca padrão de imóveis ativos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose render={<Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" />}>
              Cancelar
            </DialogClose>
            <Button 
              onClick={handleSell} 
              disabled={updateProperty.isPending}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {updateProperty.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirmar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Desativar */}
      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-bottom-10 duration-300">
          <DialogHeader>
            <DialogTitle>Desativar imóvel?</DialogTitle>
            <DialogDescription className="text-white/60">
              Você está prestes a desativar este imóvel. Ele receberá a data de hoje e sairá da listagem principal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose render={<Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" />}>
              Cancelar
            </DialogClose>
            <Button 
              onClick={handleDeactivate} 
              disabled={updateProperty.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {updateProperty.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirmar Desativação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Excluir */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-zinc-950 border border-white/10 text-white data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-bottom-10 duration-300">
          <DialogHeader>
            <DialogTitle className="text-red-500">Excluir imóvel?</DialogTitle>
            <DialogDescription className="text-white/60">
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita e todos os dados serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose render={<Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" />}>
              Cancelar
            </DialogClose>
            <Button 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
