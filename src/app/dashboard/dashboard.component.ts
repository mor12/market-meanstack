import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public lineBigDashboardChartType;
  public gradientStroke;
  public chartColor;
  public canvas: any;
  public ctx;
  public gradientFill;
  public lineBigDashboardChartData: Array<any>;
  public lineBigDashboardChartOptions: any;
  public lineBigDashboardChartLabels: Array<any>;
  public lineBigDashboardChartColors: Array<any>
  public date_init: Date;
  public date_finish: Date;
  public loading = false;
  public desayunos = 0;
  public almuerzos = 0;
  public cenas = 0;
  public sales_desayunos = 0;
  public sales_almuerzos = 0;
  public sales_cenas = 0;
  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;

  public lineChartType;
  public lineChartData: Array<any>;
  public lineChartOptions: any;
  public lineChartLabels: Array<any>;
  public lineChartColors: Array<any>

  public lineChartWithNumbersAndGridType;
  public lineChartWithNumbersAndGridData: Array<any>;
  public lineChartWithNumbersAndGridOptions: any;
  public lineChartWithNumbersAndGridLabels: Array<any>;
  public lineChartWithNumbersAndGridColors: Array<any>

  public lineChartGradientsNumbersType;
  public lineChartGradientsNumbersData: Array<any>;
  public lineChartGradientsNumbersOptions: any;
  public lineChartGradientsNumbersLabels: Array<any>;
  public lineChartGradientsNumbersColors: Array<any>
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  public employees_schedule: any[] = [];
  constructor(private reportProvider: ReportService) {
    this.loading = true;
    this.date_init = new Date();
    this.date_finish = new Date();


    reportProvider.stadisticsByEmployeeSchedule(this.date_init, this.date_finish).subscribe(res => {

      this.reportProvider.employeesSalesByHour(this.date_init, this.date_finish).subscribe(res => {

        this.sales_desayunos = 0;
        this.sales_almuerzos = 0;
        this.sales_cenas = 0;

        for (let index = 13; index < 16; index++) {
          this.sales_desayunos += res.filter(a => a._id == index).length > 0 ? res.filter(a => a._id == index)[0].count : 0;
        }

        for (let index = 17; index < 21; index++) {
          this.sales_almuerzos += res.filter(a => a._id == index).length > 0 ? res.filter(a => a._id == index)[0].count : 0;
        }

        for (let index = 22; index <= 24; index++) {
          this.sales_cenas += res.filter(a => a._id == index).length > 0 ? res.filter(a => a._id == index)[0].count : 0;
        }

      })

      this.employees_schedule.push({
        total: 15,
        name: "Mercadeo y tecnicos",
        start_time: "06:00",
        end_time: "05:00"
      })
      for (var k in res) {
        var schedule = {
          total: res[k].count,
          name: k,
          start_time: res[k].start_time,
          end_time: res[k].end_time
        }
        this.employees_schedule.push(schedule)
      }


      this.employees_schedule.forEach(schedule => {
        const hora_inico = schedule.start_time.split(":")[0];
        const hora_final = schedule.end_time.split(":")[0];

        if (hora_inico >= 5 && hora_inico <= 9) {
          this.desayunos = this.desayunos + schedule.total;
        }

        if (hora_inico >= 5 && hora_final >= 12) {
          this.almuerzos = this.almuerzos + schedule.total;
        }

        if (hora_final >= 17) {
          this.cenas = this.cenas + schedule.total;
        }

      });

      this.loading = false;
    })
  }

  ngOnInit() {
    this.reportProvider.weekSalesReport().subscribe(res => {

      const totals_array = [];

      var now = new Date();

      for (var d = new Date(new Date(new Date().setDate(new Date().getDate() - 8)).setHours(0)); d < now; d.setDate(d.getDate() + 1)) {
        var filtered = res.filter(a => new Date(d).toISOString().split("T")[0] == a.datecreated.split("T")[0])
        if (filtered.length > 0) {
          totals_array.push(filtered[0].final_total)
        } else {
          totals_array.push(0)
        }
      }

      this.lineBigDashboardChartData = [
        {
          label: "Venta",
          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          fill: true,
          borderWidth: 2,
          data: totals_array
        }
      ];


    })

    this.chartColor = "#FFFFFF";
    this.canvas = document.getElementById("bigDashboardChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    this.lineBigDashboardChartData = [
      {
        label: "Venta",

        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        fill: true,

        borderWidth: 2,
        data: [50, 150, 100, 190, 130, 90, 150, 160, 120, 140, 190, 95]
      }
    ];
    this.lineBigDashboardChartColors = [
      {
        backgroundColor: this.gradientFill,
        borderColor: this.chartColor,
        pointBorderColor: this.chartColor,
        pointBackgroundColor: "#2c2c2c",
        pointHoverBackgroundColor: "#2c2c2c",
        pointHoverBorderColor: this.chartColor,
      }
    ];

    var now = new Date();
    var daysOfYear = [];
    for (var d = new Date(new Date(new Date().setDate(new Date().getDate() - 8)).setHours(0)); d < now; d.setDate(d.getDate() + 1)) {
      daysOfYear.push(new Date(d).toISOString().split("T")[0]);
    }
    console.log(daysOfYear)
    this.lineBigDashboardChartLabels = daysOfYear
    this.lineBigDashboardChartOptions = {

      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0,
          bottom: 0
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: '#fff',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      legend: {
        position: "bottom",
        fillStyle: "#FFF",
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            drawTicks: true,
            drawBorder: false,
            display: true,
            color: "rgba(255,255,255,0.1)",
            zeroLineColor: "transparent"
          }

        }],
        xAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            display: false,

          },
          ticks: {
            padding: 10,
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold"
          }
        }]
      }
    };

    this.lineBigDashboardChartType = 'line';


    this.gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    this.gradientChartOptionsConfigurationWithNumbersAndGrid = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    this.canvas = document.getElementById("lineChartExample");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    this.lineChartData = [
      {
        label: "Active Users",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 2,
        data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630]
      }
    ];
    this.lineChartColors = [
      {
        borderColor: "#f96332",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#f96332",
        backgroundColor: this.gradientFill
      }
    ];
    this.lineChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.lineChartOptions = this.gradientChartOptionsConfiguration;

    this.lineChartType = 'line';

    this.canvas = document.getElementById("lineChartExampleWithNumbersAndGrid");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#18ce0f');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));

    this.lineChartWithNumbersAndGridData = [
      {
        label: "Email Stats",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 2,
        data: [40, 500, 650, 700, 1200, 1250, 1300, 1900]
      }
    ];
    this.lineChartWithNumbersAndGridColors = [
      {
        borderColor: "#18ce0f",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#18ce0f",
        backgroundColor: this.gradientFill
      }
    ];
    this.lineChartWithNumbersAndGridLabels = ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"];
    this.lineChartWithNumbersAndGridOptions = this.gradientChartOptionsConfigurationWithNumbersAndGrid;

    this.lineChartWithNumbersAndGridType = 'line';




    this.canvas = document.getElementById("barChartSimpleGradientsNumbers");
    this.ctx = this.canvas.getContext("2d");

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#2CA8FF', 0.6));


    this.lineChartGradientsNumbersData = [
      {
        label: "Active Countries",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 1,
        data: [80, 99, 86, 96, 123, 85, 100, 75, 88, 90, 123, 155]
      }
    ];
    this.lineChartGradientsNumbersColors = [
      {
        backgroundColor: this.gradientFill,
        borderColor: "#2CA8FF",
        pointBorderColor: "#FFF",
        pointBackgroundColor: "#2CA8FF",
      }
    ];
    this.lineChartGradientsNumbersLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.lineChartGradientsNumbersOptions = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    }

    this.lineChartGradientsNumbersType = 'bar';

  }

  applyFilter() {
    this.loading = true;
    this.reportProvider.stadisticsByEmployeeSchedule(this.date_init, this.date_finish).subscribe(res => {
      this.reportProvider.employeesSalesByHour(this.date_init, this.date_finish).subscribe(res => {

        this.sales_desayunos = 0;
        this.sales_almuerzos = 0;
        this.sales_cenas = 0;

        for (let index = 13; index < 16; index++) {
          console.log(res.filter(a => a._id == index))
          this.sales_desayunos += res.filter(a => a._id == index).length > 0 ? res.filter(a => a._id == index)[0].count : 0;
        }

        for (let index = 17; index < 21; index++) {
          console.log(res.filter(a => a._id == index))
          this.sales_almuerzos += res.filter(a => a._id == index).length > 0 ? res.filter(a => a._id == index)[0].count : 0;
        }

        for (let index = 22; index <= 24; index++) {
          console.log(res.filter(a => a._id == index))

          this.sales_cenas += res.filter(a => a._id == index).length > 0 ? res.filter(a => a._id == index)[0].count : 0;
        }
        
      })
      this.employees_schedule = [];
      this.desayunos = 0;
      this.almuerzos = 0;
      this.cenas = 0;
      this.employees_schedule.push({
        total: 15,
        name: "Mercadeo y tecnicos",
        start_time: "06:00",
        end_time: "05:00"
      })

      for (var k in res) {
        var schedule = {
          total: res[k].count,
          name: k,
          start_time: res[k].start_time,
          end_time: res[k].end_time
        }
        this.employees_schedule.push(schedule)
      }
      this.employees_schedule.forEach(schedule => {
        const hora_inico = schedule.start_time.split(":")[0];
        const hora_final = schedule.end_time.split(":")[0];

        if (hora_inico >= 5 && hora_inico <= 9) {
          this.desayunos = this.desayunos + schedule.total;
        }

        if (hora_inico >= 5 && hora_final >= 12) {
          this.almuerzos = this.almuerzos + schedule.total;
        }

        if (hora_final >= 17) {
          this.cenas = this.cenas + schedule.total;
        }

      });
      this.loading = false;
    })
  }
}
