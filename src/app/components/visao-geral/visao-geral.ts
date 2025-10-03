import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Dashboard } from '../../services/dashboard';
import { DashboardStatsModel } from '../../models/dashboard.models';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import {
  Chart,
  ChartConfiguration,
  ChartData,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend);

@Component({
  selector: 'app-visao-geral',
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './visao-geral.html',
  styleUrl: './visao-geral.scss'
})
export class VisaoGeral implements OnInit {
  public stats: DashboardStatsModel | null = null;
  public isLoading = true;
  public error: string | null = null;

  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Aplicações de Vacina por Mês',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  constructor(private dashboardService: Dashboard) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      stats: this.dashboardService.getStats(),
      aplicacoes: this.dashboardService.getAplicacoesPorMes()
    }).subscribe({
      next: (resultados) => {
        this.stats = resultados.stats;

        const labels = resultados.aplicacoes.map(item => item.mes);
        const totals = resultados.aplicacoes.map(item => Number(item.total));

        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = totals;

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível carregar os dados do painel';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
