var serverMap = '';
var serverImage = '';

switch (window.location.hostname) {
    case '192.168.33.51':
        {
            serverImage = serverMap = 'http://192.168.33.51';
            break;
        }
    case '192.168.33.51:83':
        {
            serverImage = serverMap = 'http://192.168.33.51';
            break;
        }
    case '212.26.131.151':
        {
            serverImage = serverMap = 'http://212.26.131.151';
            break;
        }
    case '212.26.144.152':
        {
            serverImage = serverMap = 'http://212.26.131.152';
            break;
        }
    case '212.26.144.110':
        {
            serverImage = serverMap = 'http://212.26.144.110';
            break;
        }
    default:
        {
            serverImage = serverMap = 'http://212.26.144.110';
            break;
        }
}

// -- click() --
$(document).ready(function () {
    var map = $("#map");

    //init();

    $('#draw_feature_path').click(function () {
        if ($(this).hasClass('olControlDrawFeaturePathItemInactive')) {
            $(this).removeClass('olControlDrawFeaturePathItemInactive');
            $(this).addClass('olControlDrawFeaturePathItemActive');

            measureControls['line'].activate();
            measureControls['polygon'].deactivate();
            measureControls['line'].setImmediate(true);

            $('#draw_feature_out').html('довжина: 0.000 km').show();
        } else {
            $(this).addClass('olControlDrawFeaturePathItemInactive');
            $(this).removeClass('olControlDrawFeaturePathItemActive');

            measureControls['line'].deactivate();
            measureControls['polygon'].deactivate();

            $('#draw_feature_out').hide();
        }

        $('#draw_feature_polygon')
            .removeClass('olControlDrawFeaturePolygonItemActive')
            .addClass('olControlDrawFeaturePolygonItemInactive');

    });

    $('#draw_feature_polygon').click(function () {
        if ($(this).hasClass('olControlDrawFeaturePolygonItemInactive')) {
            $(this).removeClass('olControlDrawFeaturePolygonItemInactive');
            $(this).addClass('olControlDrawFeaturePolygonItemActive');

            measureControls['polygon'].activate();
            measureControls['line'].deactivate();
            measureControls['polygon'].setImmediate(true);

            $('#draw_feature_out').html('площа: 0.000 м<sup>2</sup>').show();
        }
        else {
            $(this)
                .addClass('olControlDrawFeaturePolygonItemInactive')
                .removeClass('olControlDrawFeaturePolygonItemActive');

            measureControls['line'].deactivate();
            measureControls['polygon'].deactivate();

            $('#draw_feature_out').hide();
        }

        $('#draw_feature_path')
            .removeClass('olControlDrawFeaturePathItemActive')
            .addClass('olControlDrawFeaturePathItemInactive');
    });

    $('#map_control_cursor').click(function () {
        $('#draw_feature_path')
            .removeClass('olControlDrawFeaturePathItemActive')
            .addClass('olControlDrawFeaturePathItemInactive');

        $('#draw_feature_polygon')
            .removeClass('olControlDrawFeaturePolygonItemActive')
            .addClass('olControlDrawFeaturePolygonItemInactive');

        $('#draw_feature_out').hide();

        measureControls['line'].deactivate();
        measureControls['polygon'].deactivate();
    });


    $('#map_control_layers').click(function () {
        var mapContainerLayers = $('#map_container_layers');

        if (mapContainerLayers.is(':visible')) {
            mapContainerLayers.hide();

            $('#map_control_layers').find('div:first')
                .removeClass('LayersActive')
                .addClass('LayersInactive');
        }
        else {
            mapContainerLayers.show();

            $('#map_control_layers').find('div:first')
                .removeClass('LayersInactive')
                .addClass('LayersActive');
        }
    });

    var cadNumber = $('#get_serach_cadnum').val();

    if (cadNumber != '') {
        $('.sidebar').hide();
        $('.show-sidebar').show();

        $('#map_toolbar')
            .removeClass('map_toolbar_leftpanel_on')
            .addClass('map_toolbar_leftpanel_off');

        //searchCadnum(cadNumber);
    }
});

// -- set OpenLayers --
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";

// -- sets 
var mapMinZoom = 2;
var mapMaxZoom = 17;
var map;
var measureControls;
var navControls;
var markers;
var kadpodil;
var mapBounds = new OpenLayers.Bounds(-160, -74, 160, 74);


// ------------------------
// -- init() - MAIN INIT --
// ------------------------
function init() {
    OpenLayers. Lang.setCode("ru");
    mapBounds = new OpenLayers.Bounds(-160, -74, 160, 74);
    var options = {
        controls: [],
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 17,
        maxResolution: 156543.0339
    };

    // -- map.OpenLayers() - --
    map = new OpenLayers.Map('map', options);

    map.isValidZoomLevel = function (zoomLevel) {
        return ((zoomLevel != null) && (zoomLevel >= 6) && (zoomLevel <= this.getNumZoomLevels()));
    };

    map.events.register("moveend", null, function () {
        //tooltip.close();
        //alert('aaa')
    });

    map.events.register("movestart", null, function () {
        //alert('ddd')
    });

    initLayers();

    initControls();

    if (!map.getCenter()) {
        map.zoomToExtent(mapBounds.transform(map.displayProjection, map.projection));
    }

    map.setCenter(new OpenLayers.LonLat(29.91, 47.78).transform(
        new OpenLayers.Projection("EPSG:4326"),
        new OpenLayers.Projection("EPSG:900913")
    ), 6);

    initInfo();

    var disposalLayer = map.getLayersByName("Розпорядження с/г землями");
    disposalLayer[0].events.register("visibilitychanged", disposalLayer, layerChanged);
}

function layerChanged(layer) {
    if (layer.object.visibility) {
        jQuery(".landSings").show();
    } else {
        jQuery(".landSings").hide();
    }
}


function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}



function SetMarker(point) {
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var size = new OpenLayers.Size(21, 25);
    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
    var icon = new OpenLayers.Icon('http://maps.google.com/mapfiles/marker.png', size, offset);
    markers.addMarker(new OpenLayers.Marker(point, icon));

    GoogleActions.SetMarker(point);
}


function initInfo() {
    var popup = false;
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
        },
        initialize: function (options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            );
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.onClick,
                }, this.handlerOptions
            );
        },
        onClick: function (event) {
            var location = map.getLonLatFromPixel(event.xy);
            GoogleActions.PolygonPath.push({ lat: location.lat, lng: location.lon });
            SetMarker(location);
            var layers = map.getLayersBy("visibility", true);
            var activeLayers = [];
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].params !== undefined && layers[i].params.LAYERS !== undefined) {
                    activeLayers[activeLayers.length] = layers[i].params.LAYERS;
                }
            }

            var dataObj = {
                x: location.lat,
                y: location.lon,
                zoom: map.getZoom(),
                actLayers: activeLayers
            }
        }
    });

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
}
//Positioning Tabs
function initTabs() {
    var aElements = jQuery("ul#container a");
    aElements.each(function () {
        jQuery(jQuery(this)).parent().attr('class', '');
        if (jQuery(this).css("display") == 'block') {
            jQuery(jQuery(this)).parent().show();
        }
    });

    var leftWidth = 0;
    $('ul#container li').each(function () {
        var elemWidth = jQuery(this).width();
        if (elemWidth != 0) {
            jQuery(this).css({ "left": (leftWidth) + 'px' });
            leftWidth += elemWidth + 5;
        }
    });
    var widthElements = 0;
    $("ul#container li").each(function () {
        widthElements += $(this).width() + 5;
    });

    if ($('#container').width() < (widthElements + 5)) {
        $('#carouselLeft').show().css({ "opacity": 1 });
        $('#carouselRight').show().css({ "opacity": 0 });
    } else {
        $('#carouselLeft').hide();
        $('#carouselRight').hide();
    }
}


// -- initLayers() - --
function initLayers() {
    // -- KADPODIL --
    kadpodil = new OpenLayers.Layer.WMS(
        "Кадастровий поділ",
        serverMap + "/geowebcache/service/wms?tiled=true",
        {
            LAYERS: 'kadastr',
            STYLES: '',
            format: 'image/png',
            tiled: true,
            transparent: 'true'
        },
        {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: false,
            yx: { 'EPSG:900913': false }
        }
    );

    // land_disposal
    var dp_land = new OpenLayers.Layer.WMS(
        "Розпорядження с/г землями",
        serverMap + "/geoserver/gwc/service/wms?tiled=true",
        {
            LAYERS: 'dzk:dp_land',
            STYLES: '',
            format: 'image/png',
            tiled: true,
            transparent: 'true'
        },
        {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: false,
            yx: { 'EPSG:900913': false },
            visibility: false
        }
    );

    // -- STYLES - VECTOR --
    var context;

    context = {
        getColor: function (feature) {
            return feature.attributes['Colour'];
        },
        getLabel: function (feature) {
            return feature.attributes['Label'];
        }
    };

    var template = {
        strokeColor: "${getColor}",
        strokeOpacity: 1,
        strokeWidth: 2,
        fillColor: "#A9A9A9",
        fillOpacity: 0.5,
        pointRadius: 4,
        pointerEvents: "visiblePainted",
        label: "${getLabel}",
        fontColor: "${getColor}",
        fontSize: "12px",
        fontFamily: "Courier New, monospace",
        fontWeight: "bold",
        labelAlign: 'ct',
        labelColor: "#336699",
        labelYOffset: '20',
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    };

    var style = new OpenLayers.Style(template, { context: context });

    // -- OBL CENTERS --
    var vector = new OpenLayers.Layer.Vector("Обласні центри", {
        projection: "EPSG:900913",
        strategies: [new OpenLayers.Strategy.Fixed()],
        visibility: true,
        displayOutsideMaxExtent: true,
        numZoomLevels: 16,
        protocol: new OpenLayers.Protocol.HTTP({
            url: serverMap + "/files/city_obl.json",
            format: new OpenLayers.Format.GeoJSON()
        }),
        styleMap: new OpenLayers.StyleMap(style)
    });

    // -- GROUNDS --
    var grounds = new OpenLayers.Layer.WMS(
        "Грунти", serverMap + "/geowebcache/service/wms?tiled=true", {
            LAYERS: 'grunt',
            STYLES: '',
            format: 'image/png',
            tiled: true,
            transparent: 'true'
        }, {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: false,
            yx: { 'EPSG:900913': false },
            visibility: false
        });

    // -- ATU
    wms_atu = new OpenLayers.Layer.WMS(
        "АТУ", serverMap + "/geowebcache/service/wms?tiled=true", {
            LAYERS: 'atu',
            STYLES: '',
            format: 'image/png',
            tiled: true,
            transparent: 'true'
        }, {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: false,
            yx: { 'EPSG:900913': false },
            visibility: false
        }
    );

    // -- Оглядова карта (ЦДЗК) --
    dzk_overview = new OpenLayers.Layer.TMS("Оглядова карта <sup><small>(ЦДЗК)</small></sup>", "", {
        type: 'png',
        getURL: overlay_getTileURL,
        alpha: true,
        isBaseLayer: true
    });

    if (OpenLayers.Util.alphaHack() == false) {
        dzk_overview.setOpacity(0.7);
    }

    // -- MAP 100k --
    tmsoverlay = new OpenLayers.Layer.TMS("Карта масштабу М 1:100000", "", {
        type: 'jpg',
        getURL: overlay_getTileURL,
        alpha: true,
        isBaseLayer: true
    });

    if (OpenLayers.Util.alphaHack() == false) {
        tmsoverlay.setOpacity(0.7);
    }

    // -- ORTHO 10K --
    tmsoverlay_orto = new OpenLayers.Layer.TMS("Ортофотоплани", "", {
        type: 'jpg',
        getURL: overlay_getTileURL,
        alpha: true,
        isBaseLayer: true
    });

    if (OpenLayers.Util.alphaHack() == false) {
        tmsoverlay_orto.setOpacity(0.7);
    }

    // -- MARKERS --
    markers = new OpenLayers.Layer.Markers("Маркери");

    // -- MAP - ADD
    map.addLayers([markers, dzk_overview, tmsoverlay, tmsoverlay_orto, grounds, kadpodil, dp_land, wms_atu, vector]);
}

/**
 *
 */
function initControls() {
    /*map.addControl(new OpenLayers.Control.Zoom({
        zoomInId: "map_zoom_in",
        zoomOutId: "map_zoom_out"
    }));*/

    map.addControl(new OpenLayers.Control.DragPan({ enableKinetic: false }));

    navControls = new OpenLayers.Control.Navigation();
    map.addControl(navControls);

    //map.addControl(new OpenLayers.Control.Scale(OpenLayers.Util.getElement('scale')));

    //map.addControl(new OpenLayers.Control.LayerSwitcher({ 'div': OpenLayers.Util.getElement('map_container_layers') }));

    //map.addControl(new OpenLayers.Control.Permalink({ 'div': OpenLayers.Util.getElement('permalink') }));

    // -- measure - style the sketch fancy --
    var sketchSymbolizers = {
        "Point": {
            strokeWidth: 0.1,
            strokeOpacity: 0.7,
            strokeColor: "#000000",
            fillColor: "black",
            fillOpacity: 0.5,
            pointRadius: 5,
            graphicName: "cross"
        },
        "Line": { strokeWidth: 1.6, strokeOpacity: 0.7, strokeColor: "#ff0000", strokeDashstyle: "solid" },
        "Polygon": { strokeWidth: 1.6, strokeOpacity: 0.7, strokeColor: "#ff0000", fillColor: "yellow", fillOpacity: 0.3 } // "Polygon":{strokeWidth:2, strokeOpacity:1, strokeColor:"#225086", fillColor:"white", fillOpacity:0.3 }
    };

    var style = new OpenLayers.Style();
    style.addRules([new OpenLayers.Rule({ symbolizer: sketchSymbolizers })]);
    var styleMap = new OpenLayers.StyleMap({ "default": style });

    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

    measureControls = {
        line: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
            persist: true,
            displaySystem: 'metric',
            geodesic: true,
            handlerOptions: { layerOptions: { renderers: renderer, styleMap: styleMap } }
        }),
        polygon: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
            persist: true,
            displaySystem: 'metric',
            geodesic: true,
            handlerOptions: { layerOptions: { renderers: renderer, styleMap: styleMap } }
        })
    };

    var control;

    for (var key in measureControls) {
        if (measureControls.hasOwnProperty(key)) {
            control = measureControls[key];

            control.events.on({
                measure: handleMeasurements,
                measurepartial: handleMeasurements
            });

            map.addControl(control);
        }
    }
}

//Функция страбатывает при клике на карту
function initPopupInfo() {
    var popup = false;

    var info = new OpenLayers.Control.WMSGetFeatureInfo({
        //layerUrls: [serverMap + ':83' + '/geowebcache/service/wms?tiled=true'],
        layers: [kadpodil],
        infoFormat: 'application/vnd.ogc.gml',
        title: 'Identify features by clicking',
        queryVisible: true,
        eventListeners: {
            getfeatureinfo: function (event) {
                //Закрываем тултип, если он был открыт
                if (tooltip) {
                    tooltip.close();
                }

                var fat_data = event.text;

                //Чистим данные от ненужных координат, которые сильно грузят запрос когда их передаешь в PHP
                var clear_data = fat_data.replace(/<dzk:the_geom_900913.*?<\/dzk:the_geom_900913>/g, ' ');

                $.ajax({
                    url: '/kadastrova-karta/test',
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    data: { 'html': clear_data },
                    success: function (data) {
                        if (popup) {
                            popup.destroy();
                            popup = false;
                        }

                        var x = event.xy.x;
                        var y = event.xy.y;

                        if (data.pusto) {
                            alert('Данні відсутні');
                        } else {
                            // При каждом клике прячем все елементы которые ми видели при предыдущем отображении
                            $('#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal, #page_1, #page_2, #page_3, #page_4, #page_5, #page_6, #page_7').hide();

                            // Удаляем все настройки класов при каждом клике
                            $("#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal").removeClass("on");

                            // Мы отображаем только те вкладки для которых есть данные.
                            // Если вкладок несколько то активной по дефолту может быть только dilanka, ikk, rajonunion
                            if (data.dilanka) {
                                $('#a_dilanka').show().addClass('on');

                                $('#page_1')
                                    .show()
                                    .html(data.dilanka);

                                if (data.ikk) {
                                    $('#a_ikk').show();
                                    $('#page_2').html(data.ikk);
                                }

                                if (data.rajonunion) {
                                    $('#a_rajonunion').show();
                                    $('#page_4').html(data.rajonunion);
                                }

                                if (data.obl) {
                                    $('#a_obl').show();
                                    $('#page_5').html(data.obl);
                                }

                                if (data.land_disposal) {
                                    $('#a_land_disposal').show();
                                    $('#page_7').html(data.land_disposal);
                                }
                            } else if (data.ikk) {
                                $('#a_ikk').show().addClass('on');

                                $('#page_2')
                                    .show()
                                    .html(data.ikk);

                                if (data.rajonunion) {
                                    $('#a_rajonunion').show();
                                    $('#page_4').html(data.rajonunion);
                                }

                                if (data.obl) {
                                    $('#a_obl').show();
                                    $('#page_5').html(data.obl);
                                }

                                if (data.land_disposal) {
                                    $('#a_land_disposal').show();
                                    $('#page_7').html(data.land_disposal);
                                }
                            } else if (data.rajonunion) {
                                $('#a_rajonunion').show().addClass('on');

                                $('#page_4')
                                    .show()
                                    .html(data.rajonunion);

                                if (data.obl) {
                                    $('#a_obl').show();
                                    $('#page_5').html(data.obl);
                                }

                                if (data.land_disposal) {
                                    $('#a_land_disposal').show();
                                    $('#page_7').html(data.land_disposal);
                                }
                            } else if (data.obl) {
                                $('#a_obl').show().addClass('on');

                                $('#page_5')
                                    .show()
                                    .html(data.obl);
                            } else if (data.atu) {
                                $('#a_atu').show().addClass('on');

                                $('#page_3')
                                    .show()
                                    .html(data.atu);
                            } else if (data.grunt) {
                                $('#a_grunt').show().addClass('on');

                                $('#page_6')
                                    .show()
                                    .html(data.grunt);
                            }

                            tooltip.open('tooltip', x, y);
                        }
                    }
                });
            }
        }
    });

    map.addControl(info);
    info.activate();
}

//Функция страбатывает при клике на карту
function initPopupInfo_backUp() {
    var popup = false;

    var info = new OpenLayers.Control.WMSGetFeatureInfo({
        //layerUrls: [serverMap + ':83' + '/geowebcache/service/wms?tiled=true'],
        layers: [kadpodil],
        infoFormat: 'application/vnd.ogc.gml',
        title: 'Identify features by clicking',
        queryVisible: true,
        eventListeners: {
            getfeatureinfo: function (event) {
                //Закрываем тултип, если он был открыт
                if (tooltip) {
                    tooltip.close();
                }

                var fat_data = event.text;

                //Чистим данные от ненужных координат, которые сильно грузят запрос когда их передаешь в PHP
                var clear_data = fat_data.replace(/<dzk:the_geom_900913.*?<\/dzk:the_geom_900913>/g, ' ');

                $.ajax({
                    url: '/kadastrova-karta/test',
                    dataType: 'json',
                    type: 'POST',
                    async: false,
                    data: { 'html': clear_data },
                    success: function (data) {
                        if (popup) {
                            popup.destroy();
                            popup = false;
                        }

                        var x = event.xy.x;
                        var y = event.xy.y;

                        if (data.pusto) {
                            alert('Данні відсутні');
                        } else {
                            // При каждом клике прячем все елементы которые ми видели при предыдущем отображении
                            $('#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal, #page_1, #page_2, #page_3, #page_4, #page_5, #page_6, #page_7').hide();

                            // Удаляем все настройки класов при каждом клике
                            $("#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal").removeClass("on");

                            // Мы отображаем только те вкладки для которых есть данные.
                            // Если вкладок несколько то активной по дефолту может быть только dilanka, ikk, rajonunion
                            if (data.dilanka) {
                                $('#a_dilanka').show().addClass('on');

                                $('#page_1')
                                    .show()
                                    .html(data.dilanka);

                                if (data.ikk) {
                                    $('#a_ikk').show();
                                    $('#page_2').html(data.ikk);
                                }

                                if (data.rajonunion) {
                                    $('#a_rajonunion').show();
                                    $('#page_4').html(data.rajonunion);
                                }

                                if (data.obl) {
                                    $('#a_obl').show();
                                    $('#page_5').html(data.obl);
                                }

                                if (data.land_disposal) {
                                    $('#a_land_disposal').show();
                                    $('#page_7').html(data.land_disposal);
                                }
                            } else if (data.ikk) {
                                $('#a_ikk').show().addClass('on');

                                $('#page_2')
                                    .show()
                                    .html(data.ikk);

                                if (data.rajonunion) {
                                    $('#a_rajonunion').show();
                                    $('#page_4').html(data.rajonunion);
                                }

                                if (data.obl) {
                                    $('#a_obl').show();
                                    $('#page_5').html(data.obl);
                                }

                                if (data.land_disposal) {
                                    $('#a_land_disposal').show();
                                    $('#page_7').html(data.land_disposal);
                                }
                            } else if (data.rajonunion) {
                                $('#a_rajonunion').show().addClass('on');

                                $('#page_4')
                                    .show()
                                    .html(data.rajonunion);

                                if (data.obl) {
                                    $('#a_obl').show();
                                    $('#page_5').html(data.obl);
                                }

                                if (data.land_disposal) {
                                    $('#a_land_disposal').show();
                                    $('#page_7').html(data.land_disposal);
                                }
                            } else if (data.obl) {
                                $('#a_obl').show().addClass('on');

                                $('#page_5')
                                    .show()
                                    .html(data.obl);
                            } else if (data.atu) {
                                $('#a_atu').show().addClass('on');

                                $('#page_3')
                                    .show()
                                    .html(data.atu);
                            } else if (data.grunt) {
                                $('#a_grunt').show().addClass('on');

                                $('#page_6')
                                    .show()
                                    .html(data.grunt);
                            }

                            tooltip.open('tooltip', x, y);
                        }
                    }
                });
            }
        }
    });

    map.addControl(info);
    info.activate();
}


/**
 *
 * @param event
 */
function handleMeasurements(event) {
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
    var out;

    if (order == 1) {
        out = "довжина: " + measure.toFixed(3) + " " + units;
    } else {
        out = "площа: " + measure.toFixed(3) + " " + units + "<sup>2</sup>";
    }

    $('#draw_feature_out').html(out);
}

/**
 *
 * @param size
 */
function setWidth(size) {
    var mapDiv = document.getElementById('map');
    var wrapper = document.getElementById('wrapper');

    if (size == "auto") {
        mapDiv.style.width = null;
        wrapper.style.width = null;
    } else {
        mapDiv.style.width = size + "px";
        wrapper.style.width = size + "px";
    }

    map.updateSize();
}

/**
 *
 * @param size
 */
function setHeight(size) {
    var mapDiv = document.getElementById('map');

    if (size == "auto") {
        // reset back to the default value
        mapDiv.style.height = null;
    }
    else {
        mapDiv.style.height = size + "px";
    }

    map.updateSize();
}

/**
 *
 * @param bounds
 * @returns {*}
 */
function overlay_getTileURL(bounds) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();

    if (this.map.baseLayer.name == 'Virtual Earth Roads' || this.map.baseLayer.name == 'Virtual Earth Aerial' || this.map.baseLayer.name == 'Virtual Earth Hybrid') {
        z = z + 1;
    }

    if (mapBounds.intersectsBounds(bounds) && z >= mapMinZoom && z <= mapMaxZoom) {
        if (map.layers[1].visibility == true) {
            return serverImage + "/map/dzk_overview/" + z + "/" + x + "/" + y + "." + this.type;
        }

        if (map.layers[2].visibility == true) {
            return serverImage + "/map/topo100k_all/" + z + "/" + x + "/" + y + "." + this.type;
        }

        if (map.layers[3].visibility == true) {
            return serverImage + "/map/ortho10k_all/" + z + "/" + x + "/" + y + "." + this.type;
        }

    } else {
        //return "http://www.maptiler.org/img/none.png";
        return "/images/404-tile51.png";
    }
}

/**
 *
 */
function resize() {
    var map = document.getElementById("map");
    var leftSideWidth = 0;

    map.style.height = (getWindowHeight() - 72) + "px";

    map.style.width = (getWindowWidth() - 2 - leftSideWidth) + "px";

    if (map.updateSize) {
        map.updateSize();
    }
}

/**
 *
 * @param koatuu
 * @param zone
 * @param quartal
 * @param parcel
 *
 * @returns {*}
 */
function getParcelInfo(koatuu, zone, quartal, parcel) {
    var ret = [];

    $.ajax({
        url: '/kadastrova-karta/get-parcel-Info',
        dataType: 'json',
        async: false,
        data: {
            'koatuu': koatuu,
            'zone': zone,
            'quartal': quartal,
            'parcel': parcel
        },
        success: function (data) {
            ret = data.data;
        }
    });

    return ret;
}

/**
 *
 * @param cadnum
 */
function searchCadnum(cadnum) {
    var koatuu_area = parseFloat(rpad(cadnum.substring(0, 2), 10, '0'));
    var koatuu_district = parseFloat(rpad(cadnum.substring(0, 5), 10, '0'));

    $('#id_region').find('option').removeAttr('selected');
    $('#id_region').find('option[rel=' + koatuu_area + ']').attr('selected', true);

    $('#id_district').find('option').removeAttr('selected');
    $('#id_city').find('option').removeAttr('selected');

    change_region(koatuu_district);

    $.getJSON(
        'http://212.26.144.110/kadastrova-karta/find-Parcel',
        { 'cadnum': cadnum },
        function (data) {
            var output;
            var extNumber = false;

            if (data['status'] && data['data'][0]['st_xmin'] != null) {
                var x1 = data['data'][0]['st_xmin'];
                var y1 = data['data'][0]['st_ymin'];
                var x2 = data['data'][0]['st_xmax'];
                var y2 = data['data'][0]['st_ymax'];

                var new_bounds_res = new OpenLayers.Bounds.fromString(x1 + "," + y1 + "," + x2 + "," + y2);

                map.zoomToExtent(new_bounds_res);

                var x = new_bounds_res.centerLonLat.lat;
                var y = new_bounds_res.centerLonLat.lon;

                map.setCenter(new OpenLayers.LonLat(y, x), 16);
                SetMarker(new OpenLayers.LonLat(y, x))

                //var cad_arr = explode(':', cadnum);
                //var p = getParcelInfo(cad_arr[0], cad_arr[1], cad_arr[2], cad_arr[3]);

                //output = '<ul style="padding: 0;">';

                //output += '<li><div class="label" style="width:150px;">Кадастр.номер:</div><span><strong>' + cadnum + '</strong></span></li>';

                //if (p.length > 0) {
                //    if (p[0]['ownershipvalue']) {
                //        output += '<li><div class="label" style="width:150px;">Власність:</div>' + p[0]['ownershipvalue'] + '</li>';
                //    }

                //    if (p[0]['purpose']) {
                //        output += '<li><div class="label" style="width:150px;">Цільове призначення:</div>' + p[0]['purpose'] + '</li>';
                //    }

                //    if (p[0]['area']) {
                //        output += '<li><div class="label" style="width:150px;">Площа:</div>' + p[0]['area'] + ' ' + p[0]['unit_area'] + '</li>';
                //    }

                //    if (p[0]['add_date']) {
                //        output += '<li><div class="label" style="width:150px;">Дата оновлення:</div>' + p[0]['add_date'].substr(0, 10) + '</li>';
                //    }

                //    if (p[0]['ext_number']) {
                //        extNumber = p[0]['ext_number'];
                //    }
                //}

                //if (extNumber) {
                //    output += '<li><br/><div style="font-weight: normal;font-size: 11px;"><a class="open_parcel_land_disposal" data-excerpt="' + extNumber + '" href="javascript:;"><strong>Розпорядження с/г землею</strong></a></div></li>';
                //}

                //output += '<li><br/><div style="font-weight: normal;font-size: 11px;"><a class="open_request_excerpt" data-cadnum="' + cadnum + '" href="javascript:;"><strong>Замовити Витяг про земельну ділянку</strong></a></div></li>';
                ////output += '<li><br/><div style="font-weight: normal;font-size: 11px;" class="hidden"><a class="open_request_valuation" data-cadnum="' + cadnum + '" data-id-office="' + p[0]['id_office'] + '" href="javascript:;"><strong>Замовити Витяг про нормативну грошову оцінку</strong></a></div>&nbsp;</li>';
                //output += '<li><br/><div style="font-weight: normal;font-size: 11px;" class="hidden"><a href="http://e-gov.dzk.gov.ua/back/me/?cad_num=' + cadnum + '" target="_blank" style="color: #9fbeea;"><strong>Замовити Витяг про нормативну грошову оцінку</strong></a></div>&nbsp;</li>';
                //output += '<li><div style="font-weight: normal;font-size: 11px;" class="hidden"><a href="http://e-gov.dzk.gov.ua/back/cadaster/get/data/cad_num?cad_num=' + cadnum + '" target="_blank" style="color: #9fbeea;"><strong>Інформація про право власності та речові права</strong></a></div>&nbsp;</li>';
                //output += '</ul>';

                ////При каждом клике прячем все елементы которые ми видели при предыдущем отображении
                //$('#a_dilanka, #a_ikk, #a_atu, #a_rajonunion,#a_obl, #a_grunt, #a_land_disposal, #page_1, #page_2, #page_3, #page_4, #page_5, #page_6, #page_7').hide();

                ////Удаляем все настройки класов при каждом клике
                //$("#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal").removeClass("on");

                //$('#a_dilanka').show().addClass('on').html('Ділянка');
                //$('.page_dilanka').show().html(output);

                //$('#tooltip').find('.switcher span').click(function () {
                //    var id = $(this).attr('rel');
                //    var tTip = $('#tooltip');

                //    tTip.find('.switcher span').removeClass('on');

                //    $(this).addClass('on');

                //    tTip.find('.page').hide();
                //    tTip.find('.page[rel=' + id + ']').show();
                //});

                //// shift window info in polygon
                //tooltip.open('tooltip', getWindowWidth() / 2, getWindowHeight() / 2 - 30);
                //initTabs();
            } else {
                if (data['status']) {
                    $('#popup_find_msg').find('strong.cadnum').html(cadnum);

                    popup.open('popup_find_msg');
                } else {
                    alert(data['msg']);
                }
            }
        });
}

/**
 *
 * @param s
 * @returns {boolean}
 */
function is_cadnum(s) {
    var s_arr = explode(':', s);

    if (s_arr.length != 4) {
        return false;
    }

    return !!(parseFloat(s_arr[0]) > 0 && parseFloat(s_arr[3]) > 0);
}

/**
 *
 */
onresize = function () {
    //resize();
};
