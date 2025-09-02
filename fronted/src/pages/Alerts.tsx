import { useState } from 'react';
import { Plus, Search, Filter, Target, TrendingUp, TrendingDown, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AlertCard from '@/components/Alerts/AlertCard';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  direction: 'above' | 'below';
  proximity: number;
  createdAt: Date;
  isRecurring: boolean;
  isActive: boolean;
}

const Alerts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('proximity');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // New alert form state
  const [newSymbol, setNewSymbol] = useState('');
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [newDirection, setNewDirection] = useState<'above' | 'below'>('above');
  const [isRecurring, setIsRecurring] = useState(false);
  
  const { toast } = useToast();

  // Mock data for alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      symbol: 'BTCUSDT',
      targetPrice: 45000,
      currentPrice: 44750,
      direction: 'above',
      proximity: 94.4,
      createdAt: new Date('2024-01-15'),
      isRecurring: false,
      isActive: true,
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      targetPrice: 2800,
      currentPrice: 2650,
      direction: 'above',
      proximity: 73.2,
      createdAt: new Date('2024-01-15'),
      isRecurring: true,
      isActive: true,
    },
    {
      id: '3',
      symbol: 'ADAUSDT',
      targetPrice: 0.45,
      currentPrice: 0.52,
      direction: 'below',
      proximity: 86.5,
      createdAt: new Date('2024-01-14'),
      isRecurring: false,
      isActive: true,
    },
    {
      id: '4',
      symbol: 'SOLUSDT',
      targetPrice: 95,
      currentPrice: 88,
      direction: 'above',
      proximity: 42.8,
      createdAt: new Date('2024-01-13'),
      isRecurring: false,
      isActive: false,
    },
    {
      id: '5',
      symbol: 'DOTUSDT',
      targetPrice: 6.5,
      currentPrice: 7.2,
      direction: 'below',
      proximity: 89.7,
      createdAt: new Date('2024-01-12'),
      isRecurring: true,
      isActive: true,
    },
  ]);

  const popularSymbols = [
    'BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 
    'LINKUSDT', 'MATICUSDT', 'AVAXUSDT', 'ATOMUSDT', 'NEARUSDT'
  ];

  const handleCreateAlert = () => {
    if (!newSymbol || !newTargetPrice) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const targetPrice = parseFloat(newTargetPrice);
    // Simulate current price (in real app this would come from WebSocket)
    const currentPrice = targetPrice * (0.8 + Math.random() * 0.4);
    const proximity = Math.random() * 100;

    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      targetPrice,
      currentPrice,
      direction: newDirection,
      proximity,
      createdAt: new Date(),
      isRecurring,
      isActive: true,
    };

    setAlerts([...alerts, newAlert]);
    
    // Reset form
    setNewSymbol('');
    setNewTargetPrice('');
    setNewDirection('above');
    setIsRecurring(false);
    setIsCreateDialogOpen(false);

    toast({
      title: "Alerta creada",
      description: `Alerta para ${newAlert.symbol} creada exitosamente`,
    });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alerta eliminada",
      description: "La alerta ha sido eliminada correctamente",
    });
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ));
  };

  // Filter and sort alerts
  const filteredAlerts = alerts
    .filter(alert => {
      const matchesSearch = alert.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'active' && alert.isActive) ||
        (filterStatus === 'inactive' && !alert.isActive);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'proximity':
          return b.proximity - a.proximity;
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        default:
          return 0;
      }
    });

  const activeAlertsCount = alerts.filter(alert => alert.isActive).length;
  const highProximityCount = alerts.filter(alert => alert.proximity > 80 && alert.isActive).length;

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertas de Precio</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus alertas de trading en tiempo real
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nueva Alerta</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Alerta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Símbolo</Label>
                <Select value={newSymbol} onValueChange={setNewSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un par" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Precio Objetivo</Label>
                <Input
                  type="number"
                  step="0.00000001"
                  value={newTargetPrice}
                  onChange={(e) => setNewTargetPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Dirección</Label>
                <Select value={newDirection} onValueChange={(value: 'above' | 'below') => setNewDirection(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Por encima</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="below">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4" />
                        <span>Por debajo</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="recurring">Alerta recurrente</Label>
              </div>

              <Button onClick={handleCreateAlert} className="w-full">
                Crear Alerta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="trading-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeAlertsCount}</p>
              <p className="text-sm text-muted-foreground">Alertas Activas</p>
            </div>
          </div>
        </div>

        <div className="trading-card profit-glow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <Target className="w-5 h-5 text-trading-profit" />
            </div>
            <div>
              <p className="text-2xl font-bold text-trading-profit">{highProximityCount}</p>
              <p className="text-sm text-muted-foreground">Cerca del Target</p>
            </div>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{alerts.filter(a => a.isRecurring).length}</p>
              <p className="text-sm text-muted-foreground">Recurrentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="trading-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por símbolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proximity">Proximidad</SelectItem>
                <SelectItem value="created">Fecha</SelectItem>
                <SelectItem value="symbol">Símbolo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`relative ${!alert.isActive ? 'opacity-60' : ''}`}>
              <AlertCard
                alert={alert}
                onDelete={handleDeleteAlert}
              />
              {!alert.isActive && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    Inactiva
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="trading-card">
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay alertas</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron alertas con los filtros aplicados'
                : 'Crea tu primera alerta para comenzar el seguimiento de precios'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Alerta
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;