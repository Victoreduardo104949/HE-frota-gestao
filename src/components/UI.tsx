import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ title, subtitle, action, children, className, ...props }: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <div className={cn('glass-panel p-5 relative overflow-hidden', className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          <div>
            {title && <h3 className="text-sm font-semibold text-elegant-text tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[11px] text-elegant-dim mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ label, value, change, trend, unit, icon }: StatCardProps) => {
  return (
    <Card className="flex flex-col justify-between min-h-[120px]">
      <div className="flex justify-between items-start">
        <div className="data-label">{label}</div>
        {icon && <div className="text-elegant-dim">{icon}</div>}
      </div>
      
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono text-elegant-text">
          {unit === 'R$' && <span className="text-sm font-medium mr-1 opacity-50">R$</span>}
          {value}
          {unit === '%' && <span className="text-sm font-medium ml-1 opacity-50">%</span>}
        </span>
        {unit === 'km' && <span className="text-[10px] font-mono text-elegant-dim ml-1 uppercase">KM</span>}
      </div>

      {change !== undefined && (
        <div className={cn(
          "mt-2 text-[11px] flex items-center gap-1",
          trend === 'up' ? "text-elegant-success" : trend === 'down' ? "text-elegant-danger" : "text-elegant-dim"
        )}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}
          {Math.abs(change)}%
          <span className="text-elegant-dim/60 ml-1">vs mês ant.</span>
        </div>
      )}
    </Card>
  );
};
