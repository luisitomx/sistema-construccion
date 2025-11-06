'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { GET_PROJECT_STATS, GET_PROJECTS } from '@/graphql';

export default function DashboardPage() {
  const { data: statsData, loading: statsLoading } = useQuery(GET_PROJECT_STATS);
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    variables: { take: 5 },
  });

  const stats = [
    {
      title: 'Total Proyectos',
      value: statsData?.projectStats?.total || 0,
      icon: '📊',
      color: 'bg-blue-500',
    },
    {
      title: 'Proyectos Activos',
      value: statsData?.projectStats?.active || 0,
      icon: '🚀',
      color: 'bg-green-500',
    },
    {
      title: 'Completados',
      value: statsData?.projectStats?.completed || 0,
      icon: '✅',
      color: 'bg-purple-500',
    },
    {
      title: 'Borradores',
      value: statsData?.projectStats?.draft || 0,
      icon: '📝',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Bienvenido al Sistema de Construcción
            </p>
          </div>
          <Link href="/projects/new">
            <Button variant="primary">
              + Nuevo Proyecto
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color} text-white text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {statsLoading ? '...' : stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Proyectos Recientes</CardTitle>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : projectsData?.projects?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay proyectos aún</p>
                <Link href="/projects/new">
                  <Button variant="primary">
                    Crear Primer Proyecto
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projectsData?.projects?.map((project: any) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block hover:bg-gray-50 rounded-lg p-4 border border-gray-200 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'COMPLETED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
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
