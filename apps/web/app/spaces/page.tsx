'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import {
  Card,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { GET_SPACES, DELETE_SPACE } from '@/graphql';
import { formatArea } from '@/lib/utils';

export default function SpacesPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, loading, refetch } = useQuery(GET_SPACES, {
    variables: {
      skip: page * pageSize,
      take: pageSize,
    },
  });

  const [deleteSpace] = useMutation(DELETE_SPACE, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este espacio?')) {
      await deleteSpace({ variables: { id } });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Espacios</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona todos los espacios arquitectónicos
            </p>
          </div>
          <Link href="/spaces/new">
            <Button variant="primary">
              + Nuevo Espacio
            </Button>
          </Link>
        </div>

        {/* Spaces Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Cargando espacios...
              </div>
            ) : data?.spaces?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No hay espacios aún</p>
                <Link href="/spaces/new">
                  <Button variant="primary">
                    Crear Primer Espacio
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Área Requerida</TableHead>
                    <TableHead>Área Real</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.spaces?.map((space: any) => (
                    <TableRow key={space.id}>
                      <TableCell>
                        <Link
                          href={`/spaces/${space.id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {space.name}
                        </Link>
                      </TableCell>
                      <TableCell>{space.category}</TableCell>
                      <TableCell>{formatArea(space.requiredArea)}</TableCell>
                      <TableCell>
                        {space.realArea ? formatArea(space.realArea) : '-'}
                      </TableCell>
                      <TableCell>{space.quantity}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          space.priority === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : space.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {space.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/spaces/${space.id}`}>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(space.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {data?.spaces?.length > 0 && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {page + 1}
            </span>
            <Button
              variant="outline"
              disabled={data?.spaces?.length < pageSize}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
