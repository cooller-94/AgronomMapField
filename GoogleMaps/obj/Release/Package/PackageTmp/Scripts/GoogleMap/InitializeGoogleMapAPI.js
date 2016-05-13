/// <reference path="C:\Users\Vladimir\Desktop\GoogleMaps-2016-04-18 (1)\GoogleMaps\GoogleMaps\Views/GoogleMap/FieldInfo.cshtml" />
InitializeGoogleMapAPI = {
    latitude: 23.99,
    longitude: 11.13,
    DrawingManager: null,

    Init: function () {
        var latlng = new google.maps.LatLng(InitializeGoogleMapAPI.latitude, InitializeGoogleMapAPI.longitude);
        var options = {
            zoom: 3,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
        var map = new google.maps.Map($("#map_canvas")[0], options);
        var marker = new google.maps.Marker({ map: map, position: latlng });
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
        /*google.maps.event.addListener(InitializeGoogleMapAPI.DrawingManager, "overlaycomplete", function (event) {
            var newShape = event.overlay;
            newShape.type = event.type;
        });

        google.maps.event.addListener(InitializeGoogleMapAPI.DrawingManager, "overlaycomplete", function (event) {
            GoogleActions.GetFieldInfo(event.overlay.getPath().getArray(), function () {
                var area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
                $("#PolygonPoints").val(JSON.stringify(event.overlay.getPath().getArray()));
                $("#Area").val(area);
                $("#windowInfo").fadeIn();
            })
        });*/

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
    }
}