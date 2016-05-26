Statistics = {
    BaseUrl: null,
    Init: function (baseUrl) {
        Statistics.BaseUrl = baseUrl;
        Statistics.BindEvents();
        google.charts.load("current", { packages: ["corechart", "calendar"], 'language': 'ru' });
    },

    BindEvents: function () {
        $("#chartModel").on("shown.bs.modal", Statistics.ShowModel);
        $("body").on("change", "#yearChart", Statistics.ShowModelChartPie);
        $("#chartModel").on("hidden.bs.modal", function () {
            $(this).data("modal", null);
        })
    },

    DrawPieChart: function (data) {
        var dataToDraw = google.visualization.arrayToDataTable(data);

        var options = {
            title: 'Площадь засеяных культур',
            is3D: true,
            height: 400,
            width: 700,
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
        google.visualization.events.addListener(chart, 'ready', function () { Statistics.DownloadPdf("#piechart_3d svg") });
        chart.draw(dataToDraw, options);
        $("#piechart_3d svg").css("width", "90%");
        $("#piechart_3d svg").css("overflow", "hidden");

    },

    DownloadPdf: function (selector) {
        var svg = jQuery(selector);
        svg.attr("xmlns", "http://www.w3.org/2000/svg");
        svg.css('overflow', 'visible');
        var click = "return xepOnline.Formatter.Format('pdf', {render:'download', srctype:'svg'})";
        jQuery('#buttons').append('<button class = "btn btn-default btn-sm" style = "float:right" onclick="' + click + '">PDF</button>');
    },

    DrawBarChartForFieldArea: function () {
        var data = [];
        data.push(["Field", "Area", { role: "style" }]);
        for (var item of GoogleActions.Fields) {
            data.push([item.FieldTitle, item.Area, "blue"]);
        }

        
        var dataToDraw = new google.visualization.arrayToDataTable(data);

        var options = {
            title: 'Площади полей',
            width: 900,
            height:600,
            legend: { position: 'none' },
            chart: {
                title: 'Площади полей',
                subtitle: 'popularity by percentage'
            },
            bars: 'horizontal',
            axes: {
                x: {
                    0: { side: 'top', label: 'Percentage' } 
                }
            },
            bar: { groupWidth: "90%" }
        };

        var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
        chart.draw(dataToDraw, options);
    },

    DrawCalendarChart: function (jobs) {

        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Won/Loss' });

        var data = []
        for (var item of jobs) {
            data.push([new Date(item.Year, item.Month, item.Day), item.Area]);
        }

        dataTable.addRows(data);

        var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

        var options = {
            title: "Обработанная площадь поля по дням",
            calendar: { cellSize: 12 },
        };

        chart.draw(dataTable, options);
    },

    ShowModelChartPie: function () {
        $("#buttons").empty();
        $.ajax({
            url: GoogleActions.baseUrl + "/GetAreaInfo",
            data: { year: $("#yearChart").val() },
            traditional: true,
            type: 'GET',
            success: function (response) {
                var data = []
                data.push(['Task', 'Плоащади засеяных культур']);
                for (var item of response.data.Cultures) {
                    data.push([item.Culture, item.Area]);
                }

                if (data.length == 1) {
                    $("#piechart_3d").empty();
                    $("#piechart_3d").append("Нет данных по этому году")
                } else {
                    Statistics.DrawPieChart(data);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    ShowJobAccauntingChart: function () {
        $.ajax({
            url: GoogleActions.baseUrl + "/GetJobForCalendar",
            traditional: true,
            type: 'GET',
            success: function (response) {
                if (response.data.IsSuccess) {
                    Statistics.DrawCalendarChart(response.data.Jobs)
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    ShowModel: function () {
        Statistics.ShowModelChartPie();
        Statistics.DrawBarChartForFieldArea();
        Statistics.ShowJobAccauntingChart();
    },

    OnSuccessFilter: function (response) {
        if (response.data.IsSuccess) {
            Statistics.DrawCalendarChart(response.data.Jobs)
        }
    }
}