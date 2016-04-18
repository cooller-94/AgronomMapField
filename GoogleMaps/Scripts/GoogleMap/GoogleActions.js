GoogleActions = {
    baseUrl: null,
    FieldModel: null,
    PolygonPath: [],
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
                $.each(data.Fields, function (index, value) {
                    var field = new google.maps.Polygon({
                        paths: value.PolygonPoints,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });

                    field.setMap(InitializeGoogleMapAPI.DrawingManager.getMap())
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    OnSuccesSave: function (data) {
        if (data.IsSuccess = true) {
            $('#windowInfo').fadeOut();
            GoogleActions.ShowNoty("Данные успешно добавленны", "success");
        }
        else {
            GoogleActions.ShowNoty("Произошла ошибка", "error");
        }
    },

    OnFailureSave: function (data) {
        console.log("error! " + data);
    },

    ShowNoty: function (text, type) {
        noty({
            text: text,
            type: type
        });
    },

    SetMarker: function (point) {
        var latlng = new google.maps.LatLng(point.lat, point.lon);
        var marker = new google.maps.Marker({ map: InitializeGoogleMapAPI.DrawingManager.getMap(), position: latlng })
    },
}