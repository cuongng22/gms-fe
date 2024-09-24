import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
    ApexGrid,
    ApexChart,
    ApexXAxis,
    ApexYAxis,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    NgApexchartsModule,
    ApexAxisChartSeries
} from "ng-apexcharts";

export type ChartOptions = {
    plotOptions: ApexPlotOptions;
    series: ApexAxisChartSeries;
    dataLabels: ApexDataLabels;
    colors: string[];
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    grid: ApexGrid;
};

@Component({
    selector: 'app-students-interested-topics',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, NgApexchartsModule],
    templateUrl: './students-interested-topics.component.html',
    styleUrl: './students-interested-topics.component.scss'
})
export class StudentsInterestedTopicsComponent {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Courses",
                    data: [47, 69, 37, 17, 28, 40]
                }
            ],
            chart: {
                type: "bar",
                height: 421,
                toolbar: {
                    show: false
                }
            },
            colors: [
                "#605DFF"
            ],
            plotOptions: {
                bar: {
                    barHeight: '21px',
                    horizontal: true
                }
            },
            grid: {
                show: true,
                borderColor: "#ECEEF2"
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: [
                    "UX/UI Design",
                    "WordPress",
                    "Motion Design",
                    "Video Editing",
                    "Angular",
                    "Python"
                ],
                axisTicks: {
                    show: true,
                    color: '#ECEEF2'
                },
                axisBorder: {
                    show: true,
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
                labels: {
                    style: {
                        colors: "#64748B",
                        fontSize: "12px"
                    }
                },
                axisBorder: {
                    show: true,
                    color: '#ECEEF2'
                },
                axisTicks: {
                    show: true,
                    color: '#ECEEF2'
                }
            }
        };
    }

}