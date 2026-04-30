'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BrokerActionsProps {
  propertyId: string;
}

export default function BrokerActions({ propertyId }: BrokerActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProperty = trpc.property.delete.useMutation({
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.')) {
      setIsDeleting(true);
      deleteProperty.mutate({ id: propertyId });
    }
  };

  return (
    <div className="pt-8 border-t border-white/10">
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Painel do Corretor</h3>
      <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
}
