GoogleActions = {
    baseUrl: null,
    FieldModel: null,
    PolygonPath: [],
    CurrentFieldId: null,

    Init: function (baseUrl) {
        GoogleActions.baseUrl = baseUrl;
        GoogleActions.LoadFields();

    },

    GetFieldInfo: function (polygon, callback) {
        $('#windowInfo').load('/GoogleMap/GetFieldInfo', { fieldId: 1 }, function (data) {
            callback();
        });
    },

    LoadFields: function () {

        $.ajax({
            url: GoogleActions.baseUrl + "/LoadFields",
            type: 'GET',
            success: function (data) {
                //$.each(data.Fields, function (index, value) {
                //    var field = new google.maps.Polygon({
                //        paths: value.PolygonPoints,
                //        strokeColor: '#FF0000',
                //        strokeOpacity: 0.8,
                //        strokeWeight: 1,
                //        fillColor: '#FF0000',
                //        fillOpacity: 0.35
                //    });

                //    field.setMap(InitializeGoogleMapAPI.DrawingManager.getMap())
                //});

                $("#targetListFields").tmpl({ fields: data.Fields }).appendTo('.fieldsList')
            },
            error: function (data) {
                console.log(data);
            }
        });
    },


    OnSuccesSaveField: function (data) {
        if (data.IsSuccess = true) {
            GoogleActions.ShowNoty("Данные успешно добавленны", "success");
            GoogleActions.CurrentFieldId = data.data.FieldId;
            $("#fillFieldModal").modal('hide');
            $("#selectFieldModal").modal('show');
        }
        else {
            GoogleActions.ShowNoty("Произошла ошибка", "error");
        }
    },

    OnFailureSaveField: function (data) {
        GoogleActions.ShowNoty("Произошла ошибка при добавлении данных", "error");
    },

    ShowNoty: function (text, type) {
        noty({
            text: text,
            type: type
        });
    },

    SetMarker: function (point) {
        var bounds = new google.maps.LatLngBounds();
        var latlng = new google.maps.LatLng(point.lat, point.lon);
        var marker = new google.maps.Marker({ map: InitializeGoogleMapAPI.DrawingManager.getMap(), position: latlng })
    },

    OnClickSaveMap: function (sender) {
        GoogleActions.SaveMap();
        $("#selectFieldModal").modal('hide')
    },

    OnClickRowField: function (sender) {
        var id = $(sender.target).closest("tr").find("[type='hidden']").val();
        var name = $(sender.target).closest("tr")

        $.ajax({
            url: GoogleActions.baseUrl + "/LoadField",
            type: "GET",
            data: { id: id },
            success: function (response) {
                if (response.Field.PolygonPoints == null || response.Field.PolygonPoints.length == 0) {
                    return;
                }

                var array = [];
                for (var i = 0; i < response.Field.PolygonPoints.length; i++) {
                    var point = { X: response.Field.PolygonPoints[i].lng, Y: response.Field.PolygonPoints[i].lat }
                    var result = Util.MetersToLatLon(point)
                    array.push(new google.maps.LatLng(result.Latitude, result.Longitude))
                }

                var field = new google.maps.Polygon({
                    paths: array,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                });

                field.setMap(InitializeGoogleMapAPI.DrawingManager.getMap())

                InitializeGoogleMapAPI.DrawingManager.getMap().setCenter(array[0])
                InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(14);
            },
            error: function (data) {
                GoogleActions.ShowNoty("Произошла ошибка при добавлении данных", "error");
            }
        });
    },

    SaveMap: function () {
        var array = [];
        for (var i = 0; i < GoogleActions.PolygonPath.length; i++) {
            var point = { X: GoogleActions.PolygonPath[i].lng, Y: GoogleActions.PolygonPath[i].lat }
            var result = Util.MetersToLatLon(point)
            array.push(new google.maps.LatLng(result.Latitude, result.Longitude))
        }

        InitializeGoogleMapAPI.DrawPolygon(array);

        $.ajax({
            url: GoogleActions.baseUrl + "/AddFieldLocation",
            type: "POST",
            data: { fieldId: GoogleActions.CurrentFieldId, polygon: GoogleActions.PolygonPath },
            success: function (response) {
                alert('success');
            }
        });

        GoogleActions.PolygonPath = [];
    },
}