import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RxjsInteractiveService } from "./rxjs-interactive.service";

import * as Highcharts from 'highcharts';


@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
    host: {
        '(document:click)': 'handleClick($event)',
    },
})
export class AnalysisComponent implements OnInit {

    public elementRef;

    public daysList = [ "7天", "15天", "30天", "60天", "90天" ];
    public typesList = [ "typeA", "typeB", "typeC" ];

    public daysRange = "7天";
    public typesRange = "typeA";

    public showDaysDropDown: Boolean = false;
    public showTypesDropDown: Boolean = false;

    public listData;

    public chartRangeTime;

    constructor( private _rxjsService: RxjsInteractiveService, private el: ElementRef ) { 
        Highcharts.setOptions({
            lang: { thousandsSep: '' }, //数据千位分隔符             
        }); 

        this.elementRef = el;
        this.getAnalysisDataList();
    }

    ngOnInit() { }

    ngAfterViewInit(){ }

    @ViewChild('chart') public chartEl: ElementRef;
    chart: any;
    options: any;

    public selectDay(day){
        this.daysRange = day;
        this.getAnalysisDataList();
    }

    public selectType(type, index){
        this.typesRange = type;
        for (let i = 0; i < this.options.series.length; i++) {
            this.options.series[i].visible = false;
            this.options.series[i].showInLegend = false;
        }
        this.options.series[index].visible = true;
        this.options.series[index].showInLegend = true;
        this.chart = new Highcharts.Chart(this.options);
    }

    public getAnalysisDataList(){
        this._rxjsService.getAnalysisData() 
            .subscribe(
                listData => {
                    switch(this.daysRange){
                        case "7天":
                            this.listData = listData.slice(0, 7);
                            this.chartRangeTime = 24 * 3600 * 1000;
                            break;
                        case "15天":
                            this.listData = listData.slice(0, 15);
                            this.chartRangeTime = 7 * 24 * 3600 * 1000;
                            break;
                        case "30天":
                            this.listData = listData.slice(0, 30);
                            this.chartRangeTime = 7 * 24 * 3600 * 1000;
                            break;
                        case "60天":
                            this.listData = listData.slice(0, 60);
                            this.chartRangeTime = 7 * 24 * 3600 * 1000;
                            break;
                        case "90天":
                            this.listData = listData.slice(-4);
                            this.chartRangeTime = 15 * 24 * 3600 * 1000;
                            break;
                    }

                    let dataInitA = [];
                    let dataInitB = [];
                    let dataInitC = [];
                    let l = this.listData.length;

                    let categoriesData = [];

                    if(this.daysRange == "7天" || this.daysRange == "15天" || this.daysRange == "30天"){

                        for (let i = 0; i < l; i++) {
                            let timeY = parseInt(this.listData[i].date.split("/")[0]),
                                timeM = parseInt(this.listData[i].date.split("/")[1]) - 1,
                                timeD = parseInt(this.listData[i].date.split("/")[2]);
                            dataInitA.push([Date.UTC(timeY, timeM, timeD), this.listData[i].typeA]);
                            dataInitB.push([Date.UTC(timeY, timeM, timeD), this.listData[i].typeB]);
                            dataInitC.push([Date.UTC(timeY, timeM, timeD), this.listData[i].typeC]);
                        };

                        this.options = {
                            global: { useUTC: false },  // x轴为时间时
                            title: { text: '' },
                            credits: { enabled: false },  // 右下角的网址
                            chart: { },
                            colors: ["#299bd7", "#fd8d37", "#eaaa00"],
                            series: [
                                { name: 'typeA', data: dataInitA },
                                { name: 'typeB', data: dataInitB, visible: false, showInLegend: false },
                                { name: 'typeC', data: dataInitC, visible: false, showInLegend: false },
                            ],
                            xAxis: {
                                labels: {
                                    style: {
                                        color: '#999',
                                        fontSize: '12px',
                                    }
                                },
                                // tickInterval: 24 * 3600 * 1000,
                                tickInterval: this.chartRangeTime,
                                type: "datetime",
                                dateTimeLabelFormats: {
                                    day: '%Y/%m/%d',
                                    week: '%Y/%m/%d',
                                    month: '%Y/%m',
                                    year: '%Y'
                                },
                                minTickInterval: "interval",
                                maxZoom: 48 * 3600 * 1000 * 1,
                            },
                            legend: {
                                align: 'left',
                                verticalAlign: 'top',
                                x: 500,
                                y: -8,
                                floating: true,
                                itemStyle: { cursor: 'default' }
                            },
                            tooltip: {
                                crosshairs: true,
                                shared: true,
                                dateTimeLabelFormats: {
                                    day: '%Y-%m-%d',
                                    week: '%Y/%m/%d',
                                    month: '%Y/%m',
                                    year: '%Y'
                                },
                                positioner: function (labelWidth, labelHeight, point) {
                                    var tooltipX, tooltipY;
                                    if (point.plotX + labelWidth > this.chart.plotWidth) {
                                        tooltipX = point.plotX + this.chart.plotLeft - labelWidth - 20;
                                    } else {
                                        tooltipX = point.plotX + this.chart.plotLeft + 20;
                                    }
                                    tooltipY = point.plotY + this.chart.plotTop - 20;
                                    return {
                                        x: tooltipX,
                                        y: tooltipY
                                    };
                                },
                            },
                            yAxis: {
                                title: { text: '' },
                                tickAmount: 6,
                                labels: {
                                    style: {
                                        color: '#999',
                                        fontSize: '12px',
                                    }
                                },
                                allowDecimals: false
                            },
                            plotOptions: {
                                line: {
                                    marker: { symbol: "circle", },
                                    events: { legendItemClick: function(){ return false } },
                                    series: { enableMouseTracking: false }
                                }
                            }
                        };
                    } else {
                        for(let i = 0; i < l; i++){
                            dataInitA.push(this.listData[i].typeA);
                            dataInitB.push(this.listData[i].typeB);
                            dataInitC.push(this.listData[i].typeC);
                            categoriesData.push(this.listData[i].date);
                        }
                        this.options = {
                            global: { useUTC: false },
                            title: { text: '' },
                            credits: { enabled: false },
                            chart: { },
                            colors: ["#299bd7", "#f83030", "#fd8d37"],
                            series: [
                                { name: 'typeA', data: dataInitA },
                                { name: 'typeB', data: dataInitB, visible: false, showInLegend: false },
                                { name: 'typeC', data: dataInitC, visible: false, showInLegend: false },
                            ],
                            xAxis: {
                                categories: categoriesData,
                                labels: {
                                    style: {
                                        color: '#999',
                                        fontSize: '12px',
                                    }
                                },
                            },
                            legend: {
                                align: 'left',
                                verticalAlign: 'top',
                                x: 700,
                                y: -8,
                                floating: true,
                                itemStyle: { cursor: 'default' }
                            },
                            tooltip: {
                                crosshairs: true,
                                shared: true,
                                style: { zIndex: 10000 },
                                positioner: function (labelWidth, labelHeight, point) {
                                    var tooltipX, tooltipY;
                                    if (point.plotX + labelWidth > this.chart.plotWidth) {
                                        tooltipX = point.plotX + this.chart.plotLeft - labelWidth - 20;
                                    } else {
                                        tooltipX = point.plotX + this.chart.plotLeft + 20;
                                    }
                                    tooltipY = point.plotY + this.chart.plotTop - 20;
                                    return {
                                        x: tooltipX,
                                        y: tooltipY
                                    };
                                },
                            },
                            yAxis: {
                                title: { text: '' },
                                tickAmount: 6,
                                labels: {
                                    style: {
                                        color: '#999',
                                        fontSize: '12px',
                                    }
                                },
                                allowDecimals:false
                            },
                            plotOptions: {
                                line: {
                                    marker: { symbol: "circle", },
                                    events: { legendItemClick: function(){ return false } },
                                    series: { enableMouseTracking: false }
                                }
                            }
                        };                        
                    }


          
                    if ( this.chartEl && this.chartEl.nativeElement ) {
                        this.options.chart = {
                            type: 'line',
                            marginTop: 60,
                            marginBottom: 80,
                            marginRight: 60,
                            renderTo: this.chartEl.nativeElement
                        };
                        this.chart = new Highcharts.Chart(this.options);
                    }

                },
                error => {
                    console.log(error);
                }
            )
    }

    // 点击外面，下拉框隐藏
    handleClick(event){
        var clickedComponent = event.target;
        var inside = "outside";
        do {
            if (clickedComponent === this.elementRef.nativeElement.getElementsByClassName("daysValue")[0]) {
                inside = "day";
            }
            if (clickedComponent === this.elementRef.nativeElement.getElementsByClassName("typesValue")[0]) {
                inside = "type";
            } 
            if (clickedComponent === this.elementRef.nativeElement.getElementsByClassName("styleValue")[0]) {
                inside = "style";
            }            
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        switch(inside){
            case "day":
                this.el.nativeElement.getElementsByClassName("arrowDay")[0].style.borderColor = "transparent transparent #d9d9d9 transparent";
                this.el.nativeElement.getElementsByClassName("arrowDay")[0].style.top = "2px";
                this.showDaysDropDown = true;
                break;
            case "type":
                this.el.nativeElement.getElementsByClassName("arrowType")[0].style.borderColor = "transparent transparent #d9d9d9 transparent";
                this.el.nativeElement.getElementsByClassName("arrowType")[0].style.top = "2px";
                this.showTypesDropDown = true;
                break;
            default:
                this.el.nativeElement.getElementsByClassName("arrowDay")[0].style.borderColor = "#d9d9d9 transparent transparent transparent";
                this.el.nativeElement.getElementsByClassName("arrowDay")[0].style.top = "9px";
                this.showDaysDropDown = false;
                this.el.nativeElement.getElementsByClassName("arrowType")[0].style.borderColor = "#d9d9d9 transparent transparent transparent";
                this.el.nativeElement.getElementsByClassName("arrowType")[0].style.top = "9px";
                this.showTypesDropDown = false;
        }
    }
}
