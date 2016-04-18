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
        marker.addListener('click', function () {
            alert('aa')
        });
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

    BindEvents: function () {
        google.maps.event.addListener(InitializeGoogleMapAPI.DrawingManager, "overlaycomplete", function (event) {
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
        });

    }
}