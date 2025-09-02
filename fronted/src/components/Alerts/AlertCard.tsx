import { Target, TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  direction: 'above' | 'below';
  proximity: number; // 0-100%
  createdAt: Date;
  isRecurring: boolean;
}

interface AlertCardProps {
  alert: Alert;
  onDelete: (id: string) => void;
}

const AlertCard = ({ alert, onDelete }: AlertCardProps) => {
  const getProximityColor = (proximity: number) => {
    if (proximity >= 90) return 'bg-trading-profit';
    if (proximity >= 70) return 'bg-trading-warning';
    return 'bg-trading-loss';
  };

  const getProximityGlow = (proximity: number) => {
    if (proximity >= 90) return 'profit-glow';
    if (proximity >= 70) return '';
    return 'loss-glow';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-ES', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 8 
    });
  };

  const priceDifference = Math.abs(alert.targetPrice - alert.currentPrice);
  const percentageDiff = ((priceDifference / alert.currentPrice) * 100);

  return (
    <div className={`trading-card ${getProximityGlow(alert.proximity)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-accent rounded-lg">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{alert.symbol}</h4>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              {alert.direction === 'above' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{alert.direction === 'above' ? 'Por encima' : 'Por debajo'}</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(alert.id)}
          className="text-muted-foreground hover:text-trading-loss"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Price Information */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Precio Actual</p>
            <p className="text-sm font-medium">${formatPrice(alert.currentPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Precio Objetivo</p>
            <p className="text-sm font-medium">${formatPrice(alert.targetPrice)}</p>
          </div>
        </div>

        {/* Proximity Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Proximidad</span>
            <span className="text-xs font-medium">{alert.proximity.toFixed(1)}%</span>
          </div>
          <div className="proximity-bar">
            <div
              className={`proximity-fill ${getProximityColor(alert.proximity)}`}
              style={{ width: `${alert.proximity}%` }}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{alert.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Diferencia: {percentageDiff.toFixed(2)}%</span>
            {alert.isRecurring && (
              <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-xs">
                Recurrente
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;