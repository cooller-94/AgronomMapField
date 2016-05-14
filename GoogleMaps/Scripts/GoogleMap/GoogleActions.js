/// <reference path="~/Scripts/GoogleMap/InitializeGoogleMapAPI.js />
/// <reference path="~/Scripts/GoogleMap/MarkerManager.js />
GoogleActions = {
    baseUrl: null,
    FieldModel: null,
    PolygonPath: [],
    CurrentFieldId: null,
    WindowInfoHtmlContent: null,
    CurrentInfoWindow: null,
    CurrentMarker: null,
    Fields: null,
    NonSelectedCultures: [],

    Init: function (baseUrl) {
        GoogleActions.baseUrl = baseUrl;
        GoogleActions.LoadFields();
        GoogleActions.InitFilterCulture();

    },

    GetFieldInfo: function (polygon, callback) {
        $('#windowInfo').load('/GoogleMap/GetFieldInfo', { fieldId: 1 }, function (data) {
            callback();
        });
    },

    InitFilterCulture: function () {
        $('#Cultures').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            includeSelectAllOption: true,
            selectAllText: 'Выбрать все',
            nonSelectedText: 'Фильтр',
            allSelectedText: 'Выбраны все культуры',
            selectAllName: 'selectAll',
            onChange: GoogleActions.OnChangeCultureFilter
        });
        $(".multiselect-container").find("[type='checkbox']").prop("checked", true)
    },

    LoadFields: function () {
        $("#fountainG").show();

        $.ajax({
            url: GoogleActions.baseUrl + "/LoadFields",
            type: 'GET',
            success: function (data) {
                GoogleActions.Fields = data.Fields;

                for(var field of GoogleActions.Fields) {
                    GoogleActions.InitField(field);
                }

                GoogleActions.RenderFieldsTemplate();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },


    RenderFieldsTemplate: function () {
        $("#fountainG").hide();
        $(".fieldsList").empty();
        $("#targetListFields").tmpl({ fields: GoogleActions.Fields }).appendTo('.fieldsList')
    },

    OnSuccesSaveField: function (data) {
        if (data.IsSuccess = true) {
            GoogleActions.ShowNoty("Данные успешно добавленны", "success");
            GoogleActions.CurrentFieldId = data.data.FieldId;
            $("#fillFieldModal").modal('hide');
            $("#selectFieldModal").modal('show');
            GoogleActions.LoadFields();
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
        var currentField = GoogleActions.FindFieldById($(sender.target).closest(".field-item").find("[type='hidden']").val())
        GoogleActions.InitField(currentField)
        GoogleActions.ChagneActiveItem(sender.target);
        var point = Util.MetersToLatLon({ X: currentField.PolygonPoints[0].lng, Y: currentField.PolygonPoints[0].lat })
        InitializeGoogleMapAPI.DrawingManager.getMap().setCenter(new google.maps.LatLng(point.Latitude, point.Longitude));
        InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(14);
    },

    InitField: function (field) {
        if (field.PolygonPoints == null || field.PolygonPoints.length == 0) {
            return;
        }

        var array = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < field.PolygonPoints.length; i++) {
            var point = { X: field.PolygonPoints[i].lng, Y: field.PolygonPoints[i].lat }
            var result = Util.MetersToLatLon(point)
            array.push(new google.maps.LatLng(result.Latitude, result.Longitude));
            bounds.extend(array[i]);
        }

        var fieldMap = new google.maps.Polygon({
            paths: array,
            strokeColor: '#8FBC8F',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#8FBC8F',
            fillOpacity: 0.8,
            // editable: true,
        });

        fieldMap.setMap(InitializeGoogleMapAPI.DrawingManager.getMap());

        InitializeGoogleMapAPI.MarkerManager.createMarker(bounds.getCenter(), new google.maps.MarkerImage(field.CultureIconLink, null, null, null, new google.maps.Size(42, 68)), google.maps.Animation.DROP);

        GoogleActions.CurrentMarker = InitializeGoogleMapAPI.MarkerManager.getMarker(bounds.getCenter());
        google.maps.event.addListener(GoogleActions.CurrentMarker, 'click', function () { GoogleActions.OnClickMarker(InitializeGoogleMapAPI.MarkerManager.getMarker(bounds.getCenter()), field.Id) });
    },

    OnClickEditLocation: function (sender) {
        if (GoogleActions.CurrentMarker != null && GoogleActions.CurrentMarker.infowindow != null) {
            GoogleActions.CurrentMarker.infowindow.close();
        }

        GoogleActions.CurrentFieldId = $(sender.target).closest(".panel").find(".field-item [type='hidden']").val();
        $("#selectFieldModal").modal("show");
    },

    OnClickMarker: function (marker, fieldId) {
        $.ajax({
            url: GoogleActions.baseUrl + "/GetWindowInfo",
            dataType: 'html',
            contentType: 'application/json',
            data: { fieldId: fieldId },
            traditional: true,
            success: function (html) {
                GoogleActions.WindowInfoHtmlContent = html;

                GoogleActions.CurrentInfoWindow = new google.maps.InfoWindow({
                    content: html,
                    maxWidth: 800
                });
                GoogleActions.ChagneActiveItem($("[type='hidden'][value = '" + fieldId + "']"))
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

    ChagneActiveItem: function (item) {
        $(".fieldsList").children().removeClass("active-item");
        $(item).closest(".panel").addClass("active-item");
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

    FindFieldById: function (id) {
        return GoogleActions.Fields.filter(function (item, index) {
            return item.Id == id;
        })[0];
    },

    FindFieldsByCulture: function (culture) {
        return GoogleActions.Fields.filter(function (item, index) {
            return item.CurrentCulture != null && item.CurrentCulture == culture;
        });
    },

    GetBoundField: function (field) {
        var array = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < field.PolygonPoints.length; i++) {
            var point = { X: field.PolygonPoints[i].lng, Y: field.PolygonPoints[i].lat }
            var result = Util.MetersToLatLon(point)
            array.push(new google.maps.LatLng(result.Latitude, result.Longitude));
            bounds.extend(array[i]);
        }

        return bounds;
    },

    HideFieldMarker: function (culture) {
        var excludeFields = GoogleActions.FindFieldsByCulture(culture);

        if (excludeFields.length > 0) {
            for (var field of excludeFields) {
                var centerMarker = GoogleActions.GetBoundField(field).getCenter();
                InitializeGoogleMapAPI.MarkerManager.removeMarker(InitializeGoogleMapAPI.MarkerManager.getMarker(centerMarker));
            }
        }
    },

    ShowFieldMarker: function (culture) {
        var includeFields = GoogleActions.FindFieldsByCulture(culture);

        if (includeFields.length > 0) {
            for (var field of includeFields) {
                var centerMarker = GoogleActions.GetBoundField(field).getCenter();
                InitializeGoogleMapAPI.MarkerManager.createMarker(centerMarker, new google.maps.MarkerImage(field.CultureIconLink, null, null, null, new google.maps.Size(42, 68)), google.maps.Animation.DROP);
            }
        }
    },

    OnChangeCultureFilter: function (option, checked) {
        if (!checked) {
            GoogleActions.HideFieldMarker($(option).text());
        } else {
            GoogleActions.ShowFieldMarker($(option).text());
        }
    },


}