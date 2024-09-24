import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
    ApexChart,
    ApexLegend,
    ApexStroke,
    ApexTooltip,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    NgApexchartsModule,
    ApexNonAxisChartSeries
} from "ng-apexcharts";
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';

export type ChartOptions = {
    labels: any;
    chart: ApexChart;
    colors: string[];
    stroke: ApexStroke;
    legend: ApexLegend;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    series: ApexNonAxisChartSeries;
};

@Component({
    selector: 'app-leads-by-source:not(1)',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, NgApexchartsModule, MatProgressBarModule],
    templateUrl: './leads-by-source.component.html',
    styleUrl: './leads-by-source.component.scss'
})
export class LeadsBySourceComponent {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.chartOptions = {
            series: [320, 60, 30, 160, 279, 19],
            chart: {
                height: 290,
                type: "donut"
            },
            labels: [
                "Organic", "Paid", "Direct", "Social", "Referrals", "Others"
            ],
            colors: [
                "#605DFF", "#3584FC", "#AD63F6", "#0dcaf0", "#25B003", "#FD5812"
            ],
            stroke: {
                width: 1,
                show: true,
                colors: ["#ffffff"]
            },
            legend: {
                show: false,
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
            plotOptions: {
                pie: {
                    expandOnClick: false,
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                color: '#64748B'
                            },
                            value: {
                                show: true,
                                color: '#3A4252',
                                fontSize: '28px',
                                fontWeight: '600'
                            },
                            total: {
                                show: true,
                                color: '#64748B'
                            }
                        }
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            tooltip: {
                enabled: false
            }
        };
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}