/// <reference path="C:\Users\Vladimir\Desktop\GoogleMaps-2016-04-18 (1)\GoogleMaps\GoogleMaps\Views/GoogleMap/FieldInfo.cshtml" />
InitializeGoogleMapAPI = {
    latitude: 110.4744066,
    longitude: 35.183177,
    DrawingManager: null,
    MarkerManager: null,
    PolygonManager: null,

    Init: function () {
        var latlng = new google.maps.LatLng(InitializeGoogleMapAPI.latitude, InitializeGoogleMapAPI.longitude);
        var options = {
            zoom: 15,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.HYBRID,
        };
        var map = new google.maps.Map($("#map_canvas")[0], options);
        InitializeGoogleMapAPI.MarkerManager = new MarkerManager(map);
        InitializeGoogleMapAPI.PolygonManager = new PolygonManager(map);
        var weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUM
        });
        weatherLayer.setMap(map);
        var cloud = new google.maps.weather.CloudLayer();
        cloud.setMap(map)
        InitializeGoogleMapAPI.InitDwawing(map);
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
            strokeColor: '#BDB76B',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#BDB76B',
            fillOpacity: 0.35
        });

        field.setMap(InitializeGoogleMapAPI.DrawingManager.getMap());
        //InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(10);
        //InitializeGoogleMapAPI.DrawingManager.getMap().panTo(points[0]);
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
    }
}