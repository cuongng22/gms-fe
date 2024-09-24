import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
    ApexGrid,
    ApexFill,
    ApexChart,
    ApexXAxis,
    ApexStroke,
    ApexYAxis,
    ApexLegend,
    ApexMarkers,
    ApexDataLabels,
    ChartComponent,
    NgApexchartsModule,
    ApexAxisChartSeries
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    legend: ApexLegend;
    stroke: ApexStroke;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    chart: ApexChart;
    colors: string[];
    grid: ApexGrid;
    fill: ApexFill;
};

@Component({
    selector: 'app-returning-customer-rate',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, NgApexchartsModule],
    templateUrl: './returning-customer-rate.component.html',
    styleUrl: './returning-customer-rate.component.scss'
})
export class ReturningCustomerRateComponent {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Fifth Time",
                    data: [70, 23, 40, 30, 62, 52, 90, 20, 60, 53]
                },
                {
                    name: "Fourth Time",
                    data: [15, 58, 45, 38, 70, 50, 55, 60, 78, 40]
                }
            ],
            chart: {
                height: 315,
                type: "line",
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            colors: [
                "#605DFF", "#AD63F6"
            ],
            stroke: {
                curve: "smooth",
                width: 2,
            },
            grid: {
                show: true,
                borderColor: "#ECEEF2"
            },
            markers: {
                size: 4,
                strokeWidth: 0,
                shape: ["circle", "square"],
                hover: {
                    size: 5
                }
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct"
                ],
                axisTicks: {
                    show: false,
                    color: '#ECEEF2'
                },
                axisBorder: {
                    show: false,
                    color: '#ECEEF2'
                },
                labels: {
                    show: true,
                    style: {
                        colors: "#8695AA",
                        fontSize: "12px"
                    }
                }
            },
            yaxis: {
                tickAmount: 5,
                max: 100,
                min: 0,
                labels: {
                    formatter: (val) => {
                        return val + '%'
                    },
                    style: {
                        colors: "#64748B",
                        fontSize: "12px"
                    }
                },
                axisBorder: {
                    show: false,
                    color: '#ECEEF2'
                },
                axisTicks: {
                    show: false,
                    color: '#ECEEF2'
                }
            },
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
            }
        };
    }

}