'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { GET_PROJECT } from '@/graphql';
import { formatDate, formatCurrency, formatArea } from '@/lib/utils';

export default function ProjectDetailPage() {
  const params = useParams();
  const { data, loading } = useQuery(GET_PROJECT, {
    variables: { id: params.id },
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando proyecto...</p>
        </div>
      </AppLayout>
    );
  }

  const project = data?.project;

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Proyecto no encontrado</p>
          <Link href="/projects">
            <Button variant="primary" className="mt-4">
              Volver a Proyectos
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-1 text-sm text-gray-600">{project.location}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="outline">Editar</Button>
            </Link>
            <Link href="/projects">
              <Button variant="ghost">Volver</Button>
            </Link>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'COMPLETED'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="mt-1 text-gray-900">{project.description || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Área Total</label>
                <p className="mt-1 text-gray-900">
                  {project.totalArea ? formatArea(project.totalArea) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Presupuesto</label>
                <p className="mt-1 text-gray-900">
                  {project.budget ? formatCurrency(project.budget) : '-'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fechas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Inicio</label>
                <p className="mt-1 text-gray-900">
                  {project.startDate ? formatDate(project.startDate) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Fin</label>
                <p className="mt-1 text-gray-900">
                  {project.endDate ? formatDate(project.endDate) : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Creado</label>
                <p className="mt-1 text-gray-900">
                  {formatDate(project.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Actualizado</label>
                <p className="mt-1 text-gray-900">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spaces */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Espacios ({project.spaces?.length || 0})</CardTitle>
              <Link href={`/spaces/new?projectId=${project.id}`}>
                <Button variant="primary" size="sm">
                  + Agregar Espacio
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {project.spaces?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay espacios en este proyecto</p>
                <Link href={`/spaces/new?projectId=${project.id}`}>
                  <Button variant="primary">
                    Agregar Primer Espacio
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {project.spaces?.map((space: any) => (
                  <Link
                    key={space.id}
                    href={`/spaces/${space.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{space.name}</h4>
                        <p className="text-sm text-gray-500">{space.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatArea(space.requiredArea)}
                        </p>
                        {space.realArea && (
                          <p className="text-xs text-gray-500">
                            Real: {formatArea(space.realArea)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
