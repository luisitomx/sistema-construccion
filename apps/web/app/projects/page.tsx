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
import { GET_PROJECTS, DELETE_PROJECT } from '@/graphql';
import { formatDate, formatCurrency, formatArea } from '@/lib/utils';

export default function ProjectsPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, loading, refetch } = useQuery(GET_PROJECTS, {
    variables: {
      skip: page * pageSize,
      take: pageSize,
    },
  });

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      await deleteProject({ variables: { id } });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona todos tus proyectos de construcción
            </p>
          </div>
          <Link href="/projects/new">
            <Button variant="primary">
              + Nuevo Proyecto
            </Button>
          </Link>
        </div>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Cargando proyectos...
              </div>
            ) : data?.projects?.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No hay proyectos aún</p>
                <Link href="/projects/new">
                  <Button variant="primary">
                    Crear Primer Proyecto
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Área Total</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.projects?.map((project: any) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {project.name}
                        </Link>
                      </TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'COMPLETED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {project.totalArea ? formatArea(project.totalArea) : '-'}
                      </TableCell>
                      <TableCell>
                        {project.budget ? formatCurrency(project.budget) : '-'}
                      </TableCell>
                      <TableCell>
                        {project.startDate ? formatDate(project.startDate) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
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
        {data?.projects?.length > 0 && (
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
              disabled={data?.projects?.length < pageSize}
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
