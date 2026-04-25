import { Vehicle, Driver, Trip, MaintenanceRecord } from '../types';

export type AlertSeverity = 'danger' | 'warning' | 'info';

export interface AppAlert {
  id: string;
  type: 'maintenance' | 'insurance' | 'cnh' | 'productivity' | 'occurrence' | 'overdue';
  severity: AlertSeverity;
  title: string;
  message: string;
  targetId: string;
  targetType: 'vehicle' | 'driver';
  date: string;
}

export function generateAlerts(
  vehicles: Vehicle[],
  drivers: Driver[],
  maintenance: MaintenanceRecord[]
): AppAlert[] {
  const alerts: AppAlert[] = [];
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Vehicle Alerts
  vehicles.forEach(vehicle => {
    // Maintenance Proximity
    const kmToMaintenance = vehicle.nextMaintenanceKm - vehicle.currentKm;
    if (kmToMaintenance <= 0) {
      alerts.push({
        id: `maint-overdue-${vehicle.id}`,
        type: 'overdue',
        severity: 'danger',
        title: 'Manutenção Atrasada',
        message: `${vehicle.plate} (${vehicle.model}) ultrapassou o limite de revisão em ${Math.abs(kmToMaintenance)} km.`,
        targetId: vehicle.id,
        targetType: 'vehicle',
        date: now.toISOString(),
      });
    } else if (kmToMaintenance < 2000) {
      alerts.push({
        id: `maint-near-${vehicle.id}`,
        type: 'maintenance',
        severity: 'warning',
        title: 'Manutenção Próxima',
        message: `${vehicle.plate} está a ${kmToMaintenance} km da próxima revisão.`,
        targetId: vehicle.id,
        targetType: 'vehicle',
        date: now.toISOString(),
      });
    }

    // Insurance Expiry
    if (vehicle.hasInsurance) {
      const insuranceDate = new Date(vehicle.insuranceExpiry);
      if (insuranceDate < now) {
        alerts.push({
          id: `insur-expired-${vehicle.id}`,
          type: 'insurance',
          severity: 'danger',
          title: 'Seguro Vencido',
          message: `O seguro do veículo ${vehicle.plate} venceu em ${insuranceDate.toLocaleDateString('pt-BR')}.`,
          targetId: vehicle.id,
          targetType: 'vehicle',
          date: now.toISOString(),
        });
      } else if (insuranceDate < thirtyDaysFromNow) {
        alerts.push({
          id: `insur-near-${vehicle.id}`,
          type: 'insurance',
          severity: 'warning',
          title: 'Seguro a Vencer',
          message: `O seguro do veículo ${vehicle.plate} vence em ${insuranceDate.toLocaleDateString('pt-BR')}.`,
          targetId: vehicle.id,
          targetType: 'vehicle',
          date: now.toISOString(),
        });
      }
    }

    // Maintenance Status
    if (vehicle.status === 'maintenance') {
      alerts.push({
        id: `status-maint-${vehicle.id}`,
        type: 'maintenance',
        severity: 'info',
        title: 'Veículo em Oficina',
        message: `${vehicle.plate} está atualmente em manutenção.`,
        targetId: vehicle.id,
        targetType: 'vehicle',
        date: now.toISOString(),
      });
    }
  });

  // Driver Alerts
  drivers.forEach(driver => {
    // CNH Expiry
    const cnhDate = new Date(driver.cnhExpiry);
    if (cnhDate < now) {
      alerts.push({
        id: `cnh-expired-${driver.id}`,
        type: 'cnh',
        severity: 'danger',
        title: 'CNH Vencida',
        message: `A CNH do motorista ${driver.name} venceu em ${cnhDate.toLocaleDateString('pt-BR')}.`,
        targetId: driver.id,
        targetType: 'driver',
        date: now.toISOString(),
      });
    } else if (cnhDate < thirtyDaysFromNow) {
      alerts.push({
        id: `cnh-near-${driver.id}`,
        type: 'cnh',
        severity: 'warning',
        title: 'CNH a Vencer',
        message: `A CNH do motorista ${driver.name} vence em ${cnhDate.toLocaleDateString('pt-BR')}.`,
        targetId: driver.id,
        targetType: 'driver',
        date: now.toISOString(),
      });
    }

    // High Occurrences
    if (driver.occurrences >= 3) {
      alerts.push({
        id: `occur-high-${driver.id}`,
        type: 'occurrence',
        severity: 'danger',
        title: 'Alto Índice de Ocorrências',
        message: `${driver.name} possui ${driver.occurrences} ocorrências registradas. Requer atenção.`,
        targetId: driver.id,
        targetType: 'driver',
        date: now.toISOString(),
      });
    }

    // Low Productivity
    if (driver.productivity < 70 && driver.status === 'active') {
      alerts.push({
        id: `prod-low-${driver.id}`,
        type: 'productivity',
        severity: 'warning',
        title: 'Baixa Produtividade',
        message: `A produtividade de ${driver.name} está em ${driver.productivity}%.`,
        targetId: driver.id,
        targetType: 'driver',
        date: now.toISOString(),
      });
    }
  });

  return alerts.sort((a, b) => {
    const severityOrder = { danger: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
