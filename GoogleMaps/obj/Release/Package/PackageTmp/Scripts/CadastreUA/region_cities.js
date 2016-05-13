$(document).ready(function () {

    $("#id_region").change(function () {
        change_region();
    });

    $("#id_district").change(function () {
        change_district();
    });

    $("#id_city").change(function () {
        change_city();
    });
});


function change_region(koatuu_district) {
    $("#id_district").load("http://212.26.144.110/ajax/district-list",
    {
        id_region: ($("#id_region option:selected").val())
    }, function () {
        if ($("#id_region option:selected").val() > 0) {
            $("#id_district").attr("disabled", false);
            var koatuu = $("#id_region option:selected").attr('rel');

            if (parseFloat(koatuu_district) > 0) {
                $('#id_district option').removeAttr('selected');
                $('#id_district option[rel=' + koatuu_district + ']').attr('selected', true);
            } else {
                $.getJSON('http://212.26.144.110/kadastrova-karta/find-region', { 'koatuu': koatuu }, function (data) {
                    if (data['status'] && parseFloat(data['data'][0]['st_xmin']) > 0) {
                        var mapBounds = new OpenLayers.Bounds(data['data'][0]['st_xmin'], data['data'][0]['st_ymin'], data['data'][0]['st_xmax'], data['data'][0]['st_ymax']);
                        map.zoomToExtent(mapBounds.transform(map.displayProjection, map.projection));
                    } else {
                        if (isset(data['msg'])) alert(data['msg']);
                    }
                });
            }
        }
        else {
            $("#id_district").attr("disabled", true);
        }
    });
    $("#id_city").attr("disabled", true);

}

function change_district() {
    $("#id_city").load("http://212.26.144.110/ajax/cities-list",
            {
                id_district: ($("#id_district option:selected").val())
            });

    if ($("#id_district option:selected").val() > 0) {
        $("#id_city").attr("disabled", false);

        var koatuu = $("#id_district option:selected").attr('rel');

        $.getJSON('http://212.26.144.110/kadastrova-karta/find-district', { 'koatuu': koatuu }, function (data) {
            if (data['status'] && parseFloat(data['data'][0]['st_xmin']) > 0) {
                var mapBounds = new OpenLayers.Bounds(data['data'][0]['st_xmin'], data['data'][0]['st_ymin'], data['data'][0]['st_xmax'], data['data'][0]['st_ymax']);
                map.zoomToExtent(mapBounds.transform(map.displayProjection, map.projection));
            } else {
                if (isset(data['msg'])) alert(data['msg']);
            }
        });
    }
    else {
        $("#id_city").attr("disabled", true);
    }
}


function change_city() {
    Proj4js.defs["EPSG:4284"] = '+proj=longlat+ellps=kras+towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12+no_defs';
    Proj4js.defs["EPSG:4326"] = '+proj=longlat+ellps=WGS84+datum=WGS84+no_defs+towgs84=0,0,0';
    Proj4js.defs["EPSG:900913"] = '+proj=merc+a=6378137+b=6378137+lat_ts=0.0+lon_0=0.0+x_0=0.0+y_0=0+k=1.0+units=m+nadgrids=@null+wktext+over+no_defs';

    var src = new Proj4js.Proj("EPSG:4284");
    var dst = new Proj4js.Proj("EPSG:900913");

    if ($("#id_city option:selected").val() > 0) {
        var koatuu = $("#id_city option:selected").attr('rel');

        $.getJSON('http://212.26.144.110/kadastrova-karta/find-city', { 'koatuu': koatuu }, function (data) {
            if (data['status'] && parseFloat(data['data'][0]['st_xmin']) > 0) {
                var x1 = data['data'][0]['st_xmin'];
                var y1 = data['data'][0]['st_ymin'];
                var x2 = data['data'][0]['st_xmax'];
                var y2 = data['data'][0]['st_ymax'];

                var point1 = new Proj4js.Point(x1, y1);
                var point2 = new Proj4js.Point(x2, y2);

                Proj4js.transform(src, dst, point1);
                Proj4js.transform(src, dst, point2);

                var new_response = point1.x + "," + point1.y + "," + point2.x + "," + point2.y;
                var new_bounds_res = new OpenLayers.Bounds.fromString(new_response);

                //var mapBounds = new OpenLayers.Bounds(data['data'][0]['st_xmin'], data['data'][0]['st_ymin'], data['data'][0]['st_xmax'], data['data'][0]['st_ymax']);
                //map.zoomToExtent( mapBounds.transform(map.displayProjection, map.projection ));
                map.zoomToExtent(new_bounds_res);

                var x = new_bounds_res.centerLonLat.lat;
                var y = new_bounds_res.centerLonLat.lon;

                map.setCenter(new OpenLayers.LonLat(y, x), 16);
                //var mapBounds = new OpenLayers.Bounds(data['data'][0]['st_xmin'], data['data'][0]['st_ymin'], data['data'][0]['st_xmax'], data['data'][0]['st_ymax']);
                //map.zoomToExtent( mapBounds.transform(map.displayProjection, map.projection ));
            } else {
                if (isset(data['msg'])) alert(data['msg']);
            }
        });
    }
}
