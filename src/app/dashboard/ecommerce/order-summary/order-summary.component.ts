import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
    ApexChart,
    ApexLegend,
    ApexDataLabels,
    ChartComponent,
    NgApexchartsModule,
    ApexNonAxisChartSeries,
} from "ng-apexcharts";
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    chart: ApexChart;
    colors: string[];
    labels: any;
};

@Component({
    selector: 'app-order-summary',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, NgApexchartsModule, MatProgressBarModule],
    templateUrl: './order-summary.component.html',
    styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.chartOptions = {
            series: [60, 30, 10],
            chart: {
                height: 327,
                type: "donut"
            },
            labels: [
                "Completed", "New Order", "Pending"
            ],
            colors: [
                "#37D80A", "#605DFF", "#AD63F6"
            ],
            legend: {
                show: true,
                position: 'top',
                fontSize: '12px',
                horizontalAlign: 'center',
                itemMargin: {
                    horizontal: 8,
                    vertical: 0
                },
                labels: {
                    colors: '#64748B'
                },
                markers: {
                    width: 9,
                    height: 9,
                    offsetX: -2,
                    offsetY: -.5
                }
            },
            dataLabels: {
                enabled: false
            }
        };
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // isToggled
    isToggled = false;

}