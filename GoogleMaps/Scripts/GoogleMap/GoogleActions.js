GoogleActions = {
    baseUrl: null,
    FieldModel: null,
    PolygonPath: [],
    CurrentFieldId: null,
    WindowInfoHtmlContent: null,
    CurrentInfoWindow: null,
    CurrentMarker: null,

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
        GoogleActions.CurrentFieldId = $(sender.target).closest(".field-item").find("[type='hidden']").val();

        $.ajax({
            url: GoogleActions.baseUrl + "/LoadField",
            type: "GET",
            data: { id: GoogleActions.CurrentFieldId },
            success: function (response) {
                if (response.Field.PolygonPoints == null || response.Field.PolygonPoints.length == 0) {
                    return;
                }

                var array = [];
                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < response.Field.PolygonPoints.length; i++) {
                    var point = { X: response.Field.PolygonPoints[i].lng, Y: response.Field.PolygonPoints[i].lat }
                    var result = Util.MetersToLatLon(point)
                    array.push(new google.maps.LatLng(result.Latitude, result.Longitude));
                    bounds.extend(array[i]);
                }

                var field = new google.maps.Polygon({
                    paths: array,
                    strokeColor: '#' + response.Field.Color,
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: '#' + response.Field.Color,
                    fillOpacity: 0.8,
                   // editable: true,
                });

                field.setMap(InitializeGoogleMapAPI.DrawingManager.getMap())

                InitializeGoogleMapAPI.DrawingManager.getMap().setCenter(array[0]);
                InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(14);
                GoogleActions.ChagneActiveItem(sender);
                var marker = new google.maps.Marker({
                    map: InitializeGoogleMapAPI.DrawingManager.getMap(),
                    position: bounds.getCenter(),
                    icon: new google.maps.MarkerImage("http://cdn.shopify.com/s/files/1/0975/7464/files/sunflower.png?8452329196668647598", null, null, null, new google.maps.Size(42, 68))
                })
                GoogleActions.CurrentMarker = marker;
                google.maps.event.addListener(marker, 'click', function () { GoogleActions.OnClickMarker(marker) });

            },
            error: function (data) {
                GoogleActions.ShowNoty("Произошла ошибка", "error");
            }
        });
    },

    OnClickEditLocation: function (sender) {
        if (GoogleActions.CurrentMarker != null && GoogleActions.CurrentMarker.infowindow != null) {
            GoogleActions.CurrentMarker.infowindow.close();
        }

        GoogleActions.CurrentFieldId = $(sender.target).closest(".panel").find(".field-item [type='hidden']").val();
        $("#selectFieldModal").modal("show");
    },

    OnClickMarker: function (marker) {
        $.ajax({
            url: GoogleActions.baseUrl + "/GetWindowInfo",
            dataType: 'html',
            contentType: 'application/json',
            data: { fieldId: GoogleActions.CurrentFieldId },
            traditional: true,
            success: function (html) {
                GoogleActions.WindowInfoHtmlContent = html;

                GoogleActions.CurrentInfoWindow = new google.maps.InfoWindow({
                    content: html,
                    maxWidth: 800
                });

                GoogleActions.CurrentMarker = marker;
                GoogleActions.CurrentInfoWindow.open(InitializeGoogleMapAPI.DrawingManager.getMap(), marker);
                GoogleActions.LoadWeather(GoogleActions.CurrentMarker.position)
            },
            error: function (data) {
                console.log('error')
            },
        });
    },

    OnClickFullScreenWindowInfo: function (sender) {
        var element = $(".fullScreenInfo").find(".glyphicon")

        if ($(".fullScreenInfo").find(".glyphicon").hasClass("glyphicon-resize-full")) {
            GoogleActions.CurrentInfoWindow.close();
            $("#fullScreenInfoModal").modal("show");
            $("#fullScreenInfoBody").html(GoogleActions.WindowInfoHtmlContent);
            $(".fullScreenInfo").find(".glyphicon").removeClass("glyphicon-resize-full").addClass("glyphicon-resize-small");
        }
        else {
            $("#fullScreenInfoModal").modal("hide");
            GoogleActions.CurrentInfoWindow.open(InitializeGoogleMapAPI.DrawingManager.getMap(), GoogleActions.CurrentMarker);
            $(".fullScreenInfo").find(".glyphicon").removeClass("glyphicon-resize-small").addClass("glyphicon-resize-full");
        }

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

    ChagneActiveItem: function (sender) {
        $(".fieldsList").children().removeClass("active-item");
        $(sender.target).closest(".panel").addClass("active-item");
    },

    LoadWeather: function (location) {
        var locationString = location.lat() + "," + location.lng();
        $.simpleWeather({
            location: locationString,
            woeid: '',
            unit: 'c',
            success: function (weather) {
                $("#img").attr("src", weather.image);
                $("#weather-value").html(weather.temp + '&deg' + weather.units.temp);
                $("#weather-city").html(weather.city + ", " + weather.region)
            },
            error: function () {
                alert("error")
            }
        });
    },
}