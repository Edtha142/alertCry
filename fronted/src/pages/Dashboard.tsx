import { TrendingUp, Target, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/Dashboard/StatsCard';
import ConnectionStatus from '@/components/Dashboard/ConnectionStatus';
import AlertCard from '@/components/Alerts/AlertCard';

const Dashboard = () => {
  // Mock data - in real app this would come from API/WebSocket
  const stats = [
    {
      title: "Porcentaje de Acierto",
      value: "68.5%",
      subtitle: "32 de 47 alertas",
      icon: Target,
      trend: 'up' as const,
    },
    {
      title: "Ratio R/R",
      value: "1:2.3",
      subtitle: "Promedio semanal",
      icon: TrendingUp,
      trend: 'up' as const,
    },
    {
      title: "P&L Diario",
      value: "+$1,247.50",
      subtitle: "+3.2% del balance",
      icon: DollarSign,
      trend: 'up' as const,
    },
    {
      title: "Balance Actual",
      value: "$38,950.00",
      subtitle: "USDT Futures",
      icon: Activity,
      trend: 'neutral' as const,
    },
  ];

  const nearbyAlerts = [
    {
      id: '1',
      symbol: 'BTCUSDT',
      targetPrice: 45000,
      currentPrice: 44750,
      direction: 'above' as const,
      proximity: 94.4,
      createdAt: new Date('2024-01-15'),
      isRecurring: false,
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      targetPrice: 2800,
      currentPrice: 2650,
      direction: 'above' as const,
      proximity: 73.2,
      createdAt: new Date('2024-01-15'),
      isRecurring: true,
    },
    {
      id: '3',
      symbol: 'ADAUSDT',
      targetPrice: 0.45,
      currentPrice: 0.52,
      direction: 'below' as const,
      proximity: 86.5,
      createdAt: new Date('2024-01-14'),
      isRecurring: false,
    },
  ];

  const handleDeleteAlert = (id: string) => {
    console.log('Deleting alert:', id);
    // In real app, this would call an API to delete the alert
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen de tu actividad de trading
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span>Actualizado hace 5 segundos</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Status */}
        <div className="lg:col-span-1">
          <ConnectionStatus
            binanceStatus="connected"
            websocketStatus="connected"
            lastUpdate={new Date()}
          />
        </div>

        {/* Nearby Alerts */}
        <div className="lg:col-span-2">
          <div className="trading-card">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-accent rounded-lg">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Alertas Cercanas al Target</h3>
                <p className="text-sm text-muted-foreground">
                  Ordenadas por proximidad al precio objetivo
                </p>
              </div>
            </div>

            {nearbyAlerts.length > 0 ? (
              <div className="space-y-4">
                {nearbyAlerts
                  .sort((a, b) => b.proximity - a.proximity)
                  .map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onDelete={handleDeleteAlert}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay alertas activas</p>
                <p className="text-sm">Crea tu primera alerta en la sección de Alertas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-accent hover:bg-card-hover rounded-lg transition-all duration-200 text-left">
            <Target className="w-6 h-6 text-primary mb-2" />
            <p className="font-medium">Nueva Alerta</p>
            <p className="text-xs text-muted-foreground">Crear alerta de precio</p>
          </button>
          
          <button className="p-4 bg-accent hover:bg-card-hover rounded-lg transition-all duration-200 text-left">
            <TrendingUp className="w-6 h-6 text-trading-profit mb-2" />
            <p className="font-medium">Ver Posiciones</p>
            <p className="text-xs text-muted-foreground">Revisar operaciones</p>
          </button>
          
          <button className="p-4 bg-accent hover:bg-card-hover rounded-lg transition-all duration-200 text-left">
            <Activity className="w-6 h-6 text-primary mb-2" />
            <p className="font-medium">Estadísticas</p>
            <p className="text-xs text-muted-foreground">Análisis detallado</p>
          </button>
          
          <button className="p-4 bg-accent hover:bg-card-hover rounded-lg transition-all duration-200 text-left">
            <DollarSign className="w-6 h-6 text-trading-warning mb-2" />
            <p className="font-medium">Balance</p>
            <p className="text-xs text-muted-foreground">Historial P&L</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;