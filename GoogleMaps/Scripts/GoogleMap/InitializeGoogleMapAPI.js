/// <reference path="C:\Users\Vladimir\Desktop\GoogleMaps-2016-04-18 (1)\GoogleMaps\GoogleMaps\Views/GoogleMap/FieldInfo.cshtml" />
InitializeGoogleMapAPI = {
    latitude: 50.453242,
    longitude: 30.525513,
    DrawingManager: null,
    MarkerManager: null,

    Init: function () {
        var latlng = new google.maps.LatLng(InitializeGoogleMapAPI.latitude, InitializeGoogleMapAPI.longitude);
        var options = {
            zoom: 6,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.HYBRID,
        };
        var map = new google.maps.Map($("#map_canvas")[0], options);
        InitializeGoogleMapAPI.MarkerManager = new MarkerManager(map);
        var marker = new google.maps.Marker({ map: map, position: latlng });
        var weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUM
        });
        weatherLayer.setMap(map);
        var cloud = new google.maps.weather.CloudLayer();
        cloud.setMap(map)
        InitializeGoogleMapAPI.InitDwawing(map);

        $('#accordion').on('hidden.bs.collapse', function toggleChevron(e) {
            $(e.target)
                .prev('.panel-heading')
                .find("i.indicator")
                .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
        });
        $('#accordion').on('shown.bs.collapse', function toggleChevron(e) {
            $(e.target)
                .prev('.panel-heading')
                .find("i.indicator")
                .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
        });
    },

    InitDwawing: function (map) {
        InitializeGoogleMapAPI.DrawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  google.maps.drawing.OverlayType.MARKER,
                  google.maps.drawing.OverlayType.CIRCLE,
                  google.maps.drawing.OverlayType.POLYGON,
                  google.maps.drawing.OverlayType.POLYLINE,
                  google.maps.drawing.OverlayType.RECTANGLE
                ]
            },
            markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },
            circleOptions: {
                fillColor: '#B03060',
                fillOpacity: 0.2,
                strokeWeight: 2,
            }
        });
        InitializeGoogleMapAPI.DrawingManager.setMap(map);
        InitializeGoogleMapAPI.BindEvents();
    },

    DrawPolygon: function (points) {
        var field = new google.maps.Polygon({
            paths: points,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        field.setMap(InitializeGoogleMapAPI.DrawingManager.getMap());
        InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(17);
        InitializeGoogleMapAPI.DrawingManager.getMap().panTo(points[0]);
    },


    BindEvents: function () {

        $("#selectFieldModal").on("shown.bs.modal", function () {
            init();
            $(this).find(".modal-content").css("overflow", "scroll");
        });


        $("#selectFieldModal").on("hidden.bs.modal", function () {
            $(this).data("modal", null);
            $("#map").empty();
        })

        $("body").on("click", "#saveMap", GoogleActions.OnClickSaveMap);
        $("body").on("click", ".field-item", GoogleActions.OnClickRowField);
        $("body").on("click", "#editLocationField", GoogleActions.OnClickEditLocation);
        $("body").on("click", ".fullScreenInfo", GoogleActions.OnClickFullScreenWindowInfo)
    }
}