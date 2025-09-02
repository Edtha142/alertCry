import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend = 'neutral', className = '' }: StatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-trading-profit';
      case 'down':
        return 'text-trading-loss';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendGlow = () => {
    switch (trend) {
      case 'up':
        return 'profit-glow';
      case 'down':
        return 'loss-glow';
      default:
        return '';
    }
  };

  return (
    <div className={`trading-card ${getTrendGlow()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={`text-2xl font-bold ${getTrendColor()}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="p-2 bg-accent rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;