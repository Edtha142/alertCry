import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Clock, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
  marginUsed: number;
  openTime: Date;
  status: 'OPEN' | 'CLOSED';
}

const Positions = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSide, setFilterSide] = useState('all');

  // Mock data for positions
  const [positions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'LONG',
      size: 0.5,
      entryPrice: 43500,
      currentPrice: 44750,
      pnl: 625,
      pnlPercent: 2.87,
      stopLoss: 42000,
      takeProfit: 46000,
      leverage: 10,
      marginUsed: 2175,
      openTime: new Date('2024-01-15T10:30:00'),
      status: 'OPEN',
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      side: 'SHORT',
      size: 5,
      entryPrice: 2720,
      currentPrice: 2650,
      pnl: 350,
      pnlPercent: 2.57,
      stopLoss: 2800,
      takeProfit: 2600,
      leverage: 5,
      marginUsed: 2720,
      openTime: new Date('2024-01-15T14:20:00'),
      status: 'OPEN',
    },
    {
      id: '3',
      symbol: 'ADAUSDT',
      side: 'LONG',
      size: 1000,
      entryPrice: 0.48,
      currentPrice: 0.52,
      pnl: 40,
      pnlPercent: 8.33,
      stopLoss: 0.44,
      takeProfit: 0.56,
      leverage: 3,
      marginUsed: 160,
      openTime: new Date('2024-01-14T09:15:00'),
      status: 'OPEN',
    },
    {
      id: '4',
      symbol: 'SOLUSDT',
      side: 'LONG',
      size: 10,
      entryPrice: 95,
      currentPrice: 88,
      pnl: -70,
      pnlPercent: -7.37,
      stopLoss: 85,
      leverage: 2,
      marginUsed: 475,
      openTime: new Date('2024-01-13T16:45:00'),
      status: 'OPEN',
    },
    {
      id: '5',
      symbol: 'DOTUSDT',
      side: 'SHORT',
      size: 50,
      entryPrice: 7.8,
      currentPrice: 7.2,
      pnl: 30,
      pnlPercent: 7.69,
      stopLoss: 8.2,
      takeProfit: 7.0,
      leverage: 4,
      marginUsed: 97.5,
      openTime: new Date('2024-01-12T11:30:00'),
      status: 'CLOSED',
    },
  ]);

  // Filter positions
  const filteredPositions = positions.filter(position => {
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'open' && position.status === 'OPEN') ||
      (filterStatus === 'closed' && position.status === 'CLOSED');
    
    const matchesSide = 
      filterSide === 'all' ||
      (filterSide === 'long' && position.side === 'LONG') ||
      (filterSide === 'short' && position.side === 'SHORT');
    
    return matchesStatus && matchesSide;
  });

  // Calculate totals
  const openPositions = positions.filter(p => p.status === 'OPEN');
  const totalPnL = openPositions.reduce((sum, p) => sum + p.pnl, 0);
  const totalMarginUsed = openPositions.reduce((sum, p) => sum + p.marginUsed, 0);
  const profitablePositions = openPositions.filter(p => p.pnl > 0).length;

  const formatPrice = (price: number, decimals = 2) => {
    return price.toLocaleString('es-ES', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals > 2 ? 8 : decimals 
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProximityToSL = (position: Position) => {
    if (!position.stopLoss) return null;
    const distance = Math.abs(position.currentPrice - position.stopLoss);
    const maxDistance = Math.abs(position.entryPrice - position.stopLoss);
    return ((maxDistance - distance) / maxDistance) * 100;
  };

  const getProximityToTP = (position: Position) => {
    if (!position.takeProfit) return null;
    const distance = Math.abs(position.takeProfit - position.currentPrice);
    const maxDistance = Math.abs(position.takeProfit - position.entryPrice);
    return ((maxDistance - distance) / maxDistance) * 100;
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posiciones</h1>
          <p className="text-muted-foreground mt-1">
            Seguimiento de tus operaciones activas y cerradas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="trading-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{openPositions.length}</p>
              <p className="text-sm text-muted-foreground">Posiciones Abiertas</p>
            </div>
          </div>
        </div>

        <div className={`trading-card ${totalPnL >= 0 ? 'profit-glow' : 'loss-glow'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <DollarSign className={`w-5 h-5 ${totalPnL >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                ${formatPrice(totalPnL)}
              </p>
              <p className="text-sm text-muted-foreground">P&L Total</p>
            </div>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <Target className="w-5 h-5 text-trading-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">${formatPrice(totalMarginUsed)}</p>
              <p className="text-sm text-muted-foreground">Margen Usado</p>
            </div>
          </div>
        </div>

        <div className="trading-card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <TrendingUp className="w-5 h-5 text-trading-profit" />
            </div>
            <div>
              <p className="text-2xl font-bold text-trading-profit">{profitablePositions}</p>
              <p className="text-sm text-muted-foreground">En Ganancia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="trading-card">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="open">Abiertas</SelectItem>
              <SelectItem value="closed">Cerradas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSide} onValueChange={setFilterSide}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Ambos</SelectItem>
              <SelectItem value="long">LONG</SelectItem>
              <SelectItem value="short">SHORT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Positions List */}
      {filteredPositions.length > 0 ? (
        <div className="space-y-4">
          {filteredPositions.map((position) => (
            <div key={position.id} className={`trading-card ${position.pnl >= 0 ? 'profit-glow' : 'loss-glow'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{position.symbol}</h3>
                      <Badge variant={position.side === 'LONG' ? 'default' : 'secondary'}>
                        {position.side === 'LONG' ? (
                          <><TrendingUp className="w-3 h-3 mr-1" />LONG</>
                        ) : (
                          <><TrendingDown className="w-3 h-3 mr-1" />SHORT</>
                        )}
                      </Badge>
                      <Badge variant="outline">{position.leverage}x</Badge>
                      <Badge variant={position.status === 'OPEN' ? 'default' : 'secondary'}>
                        {position.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Abierta: {formatDateTime(position.openTime)}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Modificar SL/TP</DropdownMenuItem>
                    {position.status === 'OPEN' && (
                      <DropdownMenuItem className="text-trading-loss">
                        Cerrar posición
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tamaño</p>
                  <p className="font-medium">{formatPrice(position.size, 4)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Precio Entrada</p>
                  <p className="font-medium">${formatPrice(position.entryPrice)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Precio Actual</p>
                  <p className="font-medium">${formatPrice(position.currentPrice)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">P&L</p>
                  <p className={`font-bold ${position.pnl >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
                    ${formatPrice(position.pnl)} ({position.pnlPercent.toFixed(2)}%)
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Stop Loss</p>
                  <p className="font-medium">
                    {position.stopLoss ? `$${formatPrice(position.stopLoss)}` : 'N/A'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Take Profit</p>
                  <p className="font-medium">
                    {position.takeProfit ? `$${formatPrice(position.takeProfit)}` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Progress bars for SL/TP proximity */}
              {position.status === 'OPEN' && (position.stopLoss || position.takeProfit) && (
                <div className="space-y-2">
                  {position.stopLoss && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Proximidad a Stop Loss</span>
                        <span className="text-trading-loss">{getProximityToSL(position)?.toFixed(1)}%</span>
                      </div>
                      <div className="proximity-bar">
                        <div
                          className="proximity-fill bg-trading-loss"
                          style={{ width: `${getProximityToSL(position) || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {position.takeProfit && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Proximidad a Take Profit</span>
                        <span className="text-trading-profit">{getProximityToTP(position)?.toFixed(1)}%</span>
                      </div>
                      <div className="proximity-bar">
                        <div
                          className="proximity-fill bg-trading-profit"
                          style={{ width: `${getProximityToTP(position) || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="trading-card">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No hay posiciones</h3>
            <p className="text-muted-foreground">
              No se encontraron posiciones con los filtros aplicados
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;