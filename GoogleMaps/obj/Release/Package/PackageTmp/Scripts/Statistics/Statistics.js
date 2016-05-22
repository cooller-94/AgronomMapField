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
        chart.draw(dataToDraw, options);
    },

    DrawBarChartForFieldArea: function () {
        var data = [];
        data.push(["Field", "Area", { role: "style" }]);
        for (var item of GoogleActions.Fields) {
            data.push([item.FieldTitle, item.Area, "blue"]);
        }

        var dataToDraw = google.visualization.arrayToDataTable(data);

        var view = new google.visualization.DataView(dataToDraw);
        view.setColumns([0, 1,
                         {
                             calc: "stringify",
                             sourceColumn: 1,
                             type: "string",
                             role: "annotation"
                         },
                         2]);

        var options = {
            title: "Площади полей",
            width: 600,
            height: 400,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
        };
        var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
        chart.draw(view, options);
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