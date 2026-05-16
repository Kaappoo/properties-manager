'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Plus, Edit, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function UsersClient() {
  const { data: users = [], isLoading, refetch } = trpc.user.list.useQuery();
  const createMutation = trpc.user.create.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      resetForm();
      refetch();
    }
  });
  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      resetForm();
      refetch();
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdminn: false
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', isAdminn: false });
    setEditingUserId(null);
  };

  const handleEdit = (user: { id: string; name: string | null; email: string; isAdminn: boolean | null }) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      isAdminn: user.isAdminn || false
    });
    setEditingUserId(user.id);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      updateMutation.mutate({
        id: editingUserId,
        ...formData
      });
    } else {
      createMutation.mutate({
        ...formData,
        name: formData.name,
        email: formData.email,
        password: formData.password || '123456',
        isAdminn: formData.isAdminn
      });
    }
  };

  return (
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-white/40 text-sm">Administre os usuários e suas permissões no sistema.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={<Button className="shadow-[0_0_20px_rgba(14,165,233,0.2)]"><Plus className="w-5 h-5 mr-2" /> Novo Usuário</Button>} />
          <DialogContent className="sm:max-w-[425px] bg-[#111] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">{editingUserId ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Nome</label>
                <Input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Senha {editingUserId && '(deixe em branco para manter)'}</label>
                <Input
                  type="password"
                  required={!editingUserId}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isAdminn"
                  checked={formData.isAdminn}
                  onChange={e => setFormData({ ...formData, isAdminn: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                />
                <label htmlFor="isAdminn" className="text-sm font-medium text-white/70 flex items-center">
                  <Shield className="w-4 h-4 mr-1" /> Permissão de Administrador
                </label>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/5 bg-white/[0.02] overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.01]">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] group transition-colors">
                  <TableCell className="font-medium text-white">{user.name || '---'}</TableCell>
                  <TableCell className="text-white/70">{user.email}</TableCell>
                  <TableCell>
                    {user.isAdminn ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/70 ring-1 ring-inset ring-white/20">
                        Corretor
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                      <Edit className="w-4 h-4 text-white/50 hover:text-white" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-white/20 italic">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
