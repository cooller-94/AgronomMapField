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
    Polygones: [],

    Init: function (baseUrl) {
        GoogleActions.baseUrl = baseUrl;
        GoogleActions.LoadFields();
        GoogleActions.InitFilterCulture();
        GoogleActions.BindEvents();
    },

    BindEvents: function () {
        $("body").on("click", "#jobAccaunting", GoogleActions.OnJobAccauntingTabClick);
        $("body").on("click", "#jobPlanning", GoogleActions.OnJobPlanningTabClick);
        $("body").on("click", "#generalField", GoogleActions.OnGeneralFieldClick);
        $("body").on("click", ".nav-tabs li", GoogleActions.OnTabClick);
        $("body").on("click", "#SaveChanges", GoogleActions.OnClickSaveChanges);
        $("body").on("click", "#changeLocationField", GoogleActions.OnClickChangeLocation);
        $("body").on("click", "#saveMap", GoogleActions.OnClickSaveMap);
        $("body").on("click", ".field-item", GoogleActions.OnClickRowField);
        $("body").on("click", "#editField", GoogleActions.OnClickAddEditField);
        $("body").on("click", "#btnAdd", GoogleActions.OnClickAddEditField);
        $("body").on("click", "#deleteLocationField", GoogleActions.OnClickDeleteField);
        $("body").on("click", ".fullScreenInfo", GoogleActions.OnClickFullScreenWindowInfo);
        $("body").on("click", "#findField", GoogleActions.OnFindClick)
    },

    GetFieldInfo: function (fieldId, callback) {
        $('#windowInfo').load('/GoogleMap/GetFieldInfo', { fieldId: 1 }, function (data) {
            callback();
        });
    },

    InitFilterCulture: function () {
        $('#Cultures').multiselect({
            enableFiltering: true,
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
                    InitializeGoogleMapAPI.PolygonManager.createPolygon(field.PolygonPoints, field.Id, false);
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

    OnSuccesSaveField: function (response) {
        if (response.data.IsSuccess == true) {
            GoogleActions.ShowNoty("Данные успешно добавленны", "success");
            GoogleActions.CurrentFieldId = response.data.FieldId;
            $("#fillFieldModal").modal('hide');
            if (response.data.Type == "Edit") {
                GoogleActions.LoadField(GoogleActions.CurrentFieldId, function (field) {
                    for (var i = 0; i < GoogleActions.Fields.length; i++) {
                        if (GoogleActions.Fields[i].Id == field.Id) {
                            GoogleActions.Fields[i] = field;
                            break;
                        }
                    }

                    GoogleActions.RenderFieldsTemplate();
                });
            } else {
                GoogleActions.LoadField(GoogleActions.CurrentFieldId, function (field) {
                    $("#selectFieldModal").modal('show');
                    GoogleActions.Fields.push(field);
                    GoogleActions.RenderFieldsTemplate();
                });
            }
        }
        else {
            GoogleActions.ShowNoty("Произошла ошибка", "error");
        }
    },

    LoadField:function(fieldId, callback){
        $.ajax({
            url: GoogleActions.baseUrl + "/LoadField",
            data: { id: GoogleActions.CurrentFieldId },
            type: 'GET',
            success: function (data) {
                callback(data.Field);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    OnFailureSaveField: function (data) {
        GoogleActions.ShowNoty("Произошла ошибка при добавлении данных", "error");
    },

    ShowNoty: function (text, type) {
        noty({
            text: text,
            type: type,
            timeout: 2000
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

    OnClickSaveChanges: function (sender) {
        $.ajax({
            url: GoogleActions.baseUrl + "/AddEditFieldLocation",
            type: "POST",
            data: { fieldId: GoogleActions.CurrentFieldId, polygon: GoogleActions.PolygonPath, action: FormAction.Update },
            success: function (response) {
                InitializeGoogleMapAPI.PolygonManager.createPolygon(GoogleActions.PolygonPath, GoogleActions.CurrentFieldId, false);
                $.each(GoogleActions.Fields, function (index, item) {
                    if (item.Id == GoogleActions.CurrentFieldId) {
                        item.PolygonPoints = GoogleActions.PolygonPath;
                        return;
                    }
                });
                $("#SaveChanges").hide();
                GoogleActions.ShowNoty("Поле успешно изменено", "success");
                GoogleActions.PolygonPath = [];
            }
        });
    },

    OnFindClick: function (sender) {
        var term = $(sender.target).closest(".form-group").find("input").val();
        $.ajax({
            url: GoogleActions.baseUrl + "/FindField",
            type: "GET",
            data: { term: term },
            success: function (response) {

                if (response.data.Field != null) {
                    marker = InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(response.data.Field.Id);
                    new google.maps.event.trigger(marker, 'click');
                    InitializeGoogleMapAPI.DrawingManager.getMap().setCenter(new google.maps.LatLng(response.data.Field.PolygonPoints[0].lat, response.data.Field.PolygonPoints[0].lng));
                } else {
                    GoogleActions.ShowNoty('Поле не найдено', 'information')
                }

            }
        });
    },

    OnClickRowField: function (sender) {
        var currentField = GoogleActions.FindFieldById($(sender.target).closest(".field-item").find("[type='hidden']").val())

        if (GoogleActions.CurrentInfoWindow != null) {
            GoogleActions.CurrentInfoWindow.close();
        }

        if (currentField != null && currentField.PolygonPoints.length > 0) {
            // GoogleActions.InitField(currentField);
            var marker = InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(currentField.Id);
            new google.maps.event.trigger(marker, 'click');
            GoogleActions.ChagneActiveItem(sender.target);
            InitializeGoogleMapAPI.DrawingManager.getMap().setCenter(new google.maps.LatLng(currentField.PolygonPoints[0].lat, currentField.PolygonPoints[0].lng));
            InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(14);
        }
    },

    OnClickChangeLocation: function (sender) {
        GoogleActions.CurrentFieldId = $(sender.target).closest(".panel").find(".field-item [type='hidden']").val();

        var field = GoogleActions.Fields.filter(function (item, index) {
            return item.Id == GoogleActions.CurrentFieldId;
        })[0];

        if (field != null) {
            InitializeGoogleMapAPI.PolygonManager.createPolygon(field.PolygonPoints, field.Id, true);
            var polygon = InitializeGoogleMapAPI.PolygonManager.findPolygon(field.Id).polygon;
            GoogleActions.PolygonPath = polygon.getPath();

            InitializeGoogleMapAPI.DrawingManager.getMap().panTo(InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(field.Id).position);

            google.maps.event.addListener(polygon.getPath(), "insert_at", function () {
                var len = polygon.getPath().getLength();
                var htmlStr = "";
                GoogleActions.PolygonPath = [];

                for (var i = 0; i < len; i++) {
                    var _lat = polygon.getPath().getAt(i).lat();
                    var _lng = polygon.getPath().getAt(i).lng();
                    GoogleActions.PolygonPath.push({ lat: _lat, lng: _lng });
                }

                if ($("#SaveChanges").is(":hidden")) {
                    $("#SaveChanges").show();
                }
            });

            google.maps.event.addListener(polygon.getPath(), "set_at", function () {
                var len = polygon.getPath().getLength();
                var htmlStr = "";
                GoogleActions.PolygonPath = [];

                for (var i = 0; i < len; i++) {
                    var _lat = polygon.getPath().getAt(i).lat();
                    var _lng = polygon.getPath().getAt(i).lng();
                    GoogleActions.PolygonPath.push({ lat: _lat, lng: _lng });
                }

                if ($("#SaveChanges").is(":hidden")) {
                    $("#SaveChanges").show();
                }
            });

            GoogleActions.CurrentFieldId = field.Id;
        }
    },

    InitField: function (field, isNeededDraw) {
        if (field.PolygonPoints == null || field.PolygonPoints.length == 0) {
            return;
        }

        var array = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < field.PolygonPoints.length; i++) {
            array.push(new google.maps.LatLng(field.PolygonPoints[i].lat, field.PolygonPoints[i].lng));
            bounds.extend(array[i]);
        }

        var marker = InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(field.Id)

        if (marker == null) {
            InitializeGoogleMapAPI.MarkerManager.createMarker(bounds.getCenter(), new google.maps.MarkerImage(field.CultureIconLink, null, null, null, new google.maps.Size(30, 40)), google.maps.Animation.DROP, field.Id);
            marker = InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(field.Id);
            google.maps.event.addListener(marker, 'click', function () { GoogleActions.OnClickMarker(field.Id) });
        }

    },

    OnClickAddEditField: function (sender) {
        GoogleActions.CurrentFieldId = $(sender.target).closest(".panel").find(".field-item [type='hidden']").val();

        $('#windowInfo').load('/GoogleMap/GetFieldInfo', { fieldId: GoogleActions.CurrentFieldId }, function (html) {
            $("#fillFieldModal").modal('show');
            $("#editFieldContent").html(html);
        });
    },

    OnClickMarker: function (fieldId) {
        $.ajax({
            url: GoogleActions.baseUrl + "/GetWindowInfo",
            dataType: 'html',
            contentType: 'application/json',
            traditional: true,
            success: function (html) {
                GoogleActions.WindowInfoHtmlContent = html;

                if (GoogleActions.CurrentInfoWindow != null) {
                    GoogleActions.CurrentInfoWindow.close();
                }

                var marker = InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(fieldId)

                GoogleActions.OpenWindow(marker, html);
                GoogleActions.ChagneActiveItem($("[type='hidden'][value = '" + fieldId + "']"))
                GoogleActions.CurrentFieldId = fieldId;
                GoogleActions.OnGeneralFieldClick();
            },
            error: function (data) {
                console.log('error')
            },
        });
    },

    OpenWindow: function (marker, html) {
        GoogleActions.CurrentInfoWindow = new google.maps.InfoWindow({
            content: html,
            maxWidth: 800
        });

        GoogleActions.CurrentMarker = marker;
        GoogleActions.CurrentInfoWindow.open(InitializeGoogleMapAPI.DrawingManager.getMap(), marker);
    },

    OnTabClick: function (sender) {
        if ($(sender.target).attr("id") == "generalField") {
            $(".nav-field li").last().hide()
        } else {
            $(".nav-field li").last().show()
        }
    },

    OnJobAccauntingTabClick: function (sender) {
        $.ajax({
            url: GoogleActions.baseUrl + "/GetJobAccaunting",
            data: { fieldId: GoogleActions.CurrentFieldId },
            beforeSend: function () {
                $("#menu1").html("")
                GoogleActions.ShowMask();
            },
            complete: function () {
                $(".img-loading").hide();
            },
            success: function (html) {
                GoogleActions.WindowInfoHtmlContent = html;


                if ($(".fullScreenInfo").find(".glyphicon").hasClass("glyphicon-resize-full")) {
                    $("#menu1").html(html);
                    $(".form-partial").hide();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    OnJobPlanningTabClick: function (sender) {
        var id = $(".FieldId").first().val();
        $.ajax({
            url: GoogleActions.baseUrl + "/GetJobPlaning",
            data: { fieldId: GoogleActions.CurrentFieldId },
            beforeSend: function () {
                $("#menu2").html("")
                GoogleActions.ShowMask();
            },
            complete: function () {
                $(".img-loading").hide();
            },
            success: function (html) {
                GoogleActions.WindowInfoHtmlContent = html;


                if ($(".fullScreenInfo").find(".glyphicon").hasClass("glyphicon-resize-full")) {
                    $("#menu2").html(GoogleActions.WindowInfoHtmlContent);
                    $(".form-partial").hide();
                }

            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    OnGeneralFieldClick: function (sender) {
        $.ajax({
            url: GoogleActions.baseUrl + "/GetFieldPartial",
            data: { fieldId: GoogleActions.CurrentFieldId },
            beforeSend: function () {
                $("#home").html("");
                GoogleActions.ShowMask();
            },
            complete: function () {
                $(".img-loading").hide();
            },
            success: function (html) {
                GoogleActions.WindowInfoHtmlContent = html;


                if ($(".fullScreenInfo").find(".glyphicon").hasClass("glyphicon-resize-full")) {
                    $("#home").html(GoogleActions.WindowInfoHtmlContent);
                }
                GoogleActions.LoadWeather(GoogleActions.CurrentMarker.position)
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    OnSuccessLoadFromFilter: function (response) {
        if (response.length > 0) {
            GoogleActions.WindowInfoHtmlContent = response;
            $("#jobTableBody").html(GoogleActions.WindowInfoHtmlContent);
            $(".FieldId").val(GoogleActions.CurrentFieldId)
        }
    },

    OnClickFullScreenWindowInfo: function (sender) {
        var element = $(".fullScreenInfo").find(".glyphicon")

        if ($(".fullScreenInfo").find(".glyphicon").hasClass("glyphicon-resize-full")) {
            GoogleActions.CurrentInfoWindow.close();
            $("#fullScreenInfoModal").modal("show");
            $(".form-partial").show();
            $("#jobTableBody").html(GoogleActions.WindowInfoHtmlContent);
            $(".FieldId").val(GoogleActions.CurrentFieldId)
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
        InitializeGoogleMapAPI.DrawingManager.getMap().setZoom(15);
        InitializeGoogleMapAPI.DrawingManager.getMap().panTo(array[0]);

        $.ajax({
            url: GoogleActions.baseUrl + "/AddEditFieldLocation",
            type: "POST",
            data: { fieldId: GoogleActions.CurrentFieldId, polygon: GoogleActions.ConvertToGoogleMapsCoorditanes(GoogleActions.PolygonPath), action: FormAction.Create },
            success: function (response) {
                $.each(GoogleActions.Fields, function (index, item) {
                    if (item.Id == GoogleActions.CurrentFieldId) {
                        item.PolygonPoints = GoogleActions.PolygonPath;
                    }
                });

                GoogleActions.PolygonPath = [];
            },
            error: function () {
                GoogleActions.ShowNoty("Произошла ошибка", "error");
            },
        });
    },

    OnClickDeleteField: function (sender) {
        if (confirm("Вы действительно хотите удалить это поле?")) {
            var fieldId = $(sender.target).closest(".panel").find(".field-item [type='hidden']").val();
            GoogleActions.DeleteField(fieldId);
        }

    },

    DeleteField: function (fieldId) {
        $.ajax({
            url: GoogleActions.baseUrl + "/Delete",
            data: { fieldId: fieldId },
            success: function (response) {
                if (response.data.IsSuccess) {
                    GoogleActions.ShowNoty("Поле успешно удалено", "success");
                    GoogleActions.Fields = GoogleActions.Fields.filter(function (item, index) {
                        return item.Id != fieldId;
                    });
                    InitializeGoogleMapAPI.PolygonManager.removePolygon(fieldId);
                    InitializeGoogleMapAPI.MarkerManager.removeMarkerByFieldId(fieldId);
                    GoogleActions.RenderFieldsTemplate();
                } else {
                    GoogleActions.ShowNoty("При удалении произошла ошибка", "error");
                }
            },
            error: function (response) {

            }
        });
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
            array.push(new google.maps.LatLng(field.PolygonPoints[i].lat, field.PolygonPoints[i].lng));
            bounds.extend(array[i]);
        }

        return bounds;
    },

    HideFieldMarker: function (culture) {
        var excludeFields = GoogleActions.FindFieldsByCulture(culture);

        if (excludeFields.length > 0) {
            for (var field of excludeFields) {
                InitializeGoogleMapAPI.MarkerManager.removeMarkerByFieldId(field.Id);
            }
        }
    },

    ShowFieldMarker: function (culture) {
        var includeFields = GoogleActions.FindFieldsByCulture(culture);

        if (includeFields.length > 0) {
            $.each(includeFields, function (index, field) {
                var array = [];
                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < field.PolygonPoints.length; i++) {
                    array.push(new google.maps.LatLng(field.PolygonPoints[i].lat, field.PolygonPoints[i].lng));
                    bounds.extend(array[i]);
                }
                InitializeGoogleMapAPI.MarkerManager.createMarker(bounds.getCenter(), new google.maps.MarkerImage(field.CultureIconLink, null, null, null, new google.maps.Size(30, 40)), google.maps.Animation.DROP, field.Id);
                google.maps.event.addListener(InitializeGoogleMapAPI.MarkerManager.getMarkerByFieldId(field.Id), 'click', function () { GoogleActions.OnClickMarker(field.Id) });
            })
        }
    },

    OnChangeCultureFilter: function (option, checked) {
        if (!checked) {
            GoogleActions.HideFieldMarker($(option).text());
        } else {
            GoogleActions.ShowFieldMarker($(option).text());
        }
    },

    ConvertToGoogleMapsCoorditanes: function (data) {
        var result = [];
        for (var i = 0; i < GoogleActions.PolygonPath.length; i++) {
            var point = { X: GoogleActions.PolygonPath[i].lng, Y: GoogleActions.PolygonPath[i].lat }
            let convertedLocation = Util.MetersToLatLon(point)
            result.push({ lat: convertedLocation.Latitude, lng: convertedLocation.Longitude });
        }

        return result;
    },

    ShowMask: function () {
        $(".img-loading").show();
        //$(".img-loading").css("display", "block");
    }

}