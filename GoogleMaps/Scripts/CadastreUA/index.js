$(document).ready(function () {
    $('#open_feed_back').click(function () {
        popup.open('popup_feedback');
        refreshCaptcha();
    });

    $('.full-search-switcher').click(function () {
        if ($('.full-search').is(':visible')) {
            $('.full-search-switcher').removeClass('switcher-close');
            $('.full-search-switcher').addClass('switcher-open');
        }
        else {
            $('.full-search-switcher').removeClass('switcher-open');
            $('.full-search-switcher').addClass('switcher-close');
        }

        $('.full-search').slideToggle();
    });

    $('.full-search > .switcher > span').click(function () {
        var id = $(this).attr('rel');
        $('.full-search > .switcher > span').removeClass('on');
        $(this).addClass('on');

        $('.full-search .page').hide();
        $('.full-search .page[rel=' + id + ']').show();
    });

    // Спрятать сайдбар
    $('.search-container > .hide').click(function () {
        $('.sidebar').hide();
        $('.show-sidebar').show();
        $('#map_toolbar').removeClass('map_toolbar_leftpanel_on');
        $('#map_toolbar').addClass('map_toolbar_leftpanel_off');
    });

    // Показать сайдбар
    $('.show-sidebar').click(function () {
        $('.sidebar').show();
        $('.show-sidebar').hide();
        $('#map_toolbar').addClass('map_toolbar_leftpanel_on');
        $('#map_toolbar').removeClass('map_toolbar_leftpanel_off');
    });

    $('#map_search_btn').click(function () {
        var s = trim($('#map_search').val());
        if (is_cadnum(s)) {
            searchCadnum(s);
        } else {
            alert('Кадастровий номер введений не вірно. Будь-ласка введіть кадастровий номер у вірному форматі.');
        }
    });

    $('#map_search').keypress(function (event) {
        if (event.which == 13) {
            var s = trim($('#map_search').val());

            if (is_cadnum(s)) {
                searchCadnum(s);
            } else {
                alert('Кадастровий номер введений не вірно. Будь-ласка введіть кадастровий номер у вірному форматі.');
            }
        }
    });

    $('#is_agree').click(function () {
        if ($(this).is(':checked'))
            $('#btn_feedback').attr('disabled', false);
        else
            $('#btn_feedback').attr('disabled', true);
    });

    $('#chk_feedback_no_errors').click(function () {
        if ($(this).is(':checked')) {
            $('input.problem').attr('disabled', true);
            $('input.problem').attr('checked', false);
        }
        else
            $('input.problem').attr('disabled', false);
    });

    $('#map_control_print').click(function () {
        var url = $('#permalink a').attr('href');
        var aurl = explode('?', url);

        window.open('/kadastrova-karta/print?' + aurl[1], 'mywindow', 'width=600,height=600,resizable=no,scrollbars=no,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no');
    });

    $('#btn_feedback').click(function () {
        var cadnum = $('#popup_feedback input[name=cadnum]').val();

        var no_parcel = $('#popup_feedback input[name=no_parcel]').is(':checked');
        var no_cadnum = $('#popup_feedback input[name=no_cadnum]').is(':checked');
        var error_location = $('#popup_feedback input[name=error_location]').is(':checked');
        var error_configuration = $('#popup_feedback input[name=error_configuration]').is(':checked');
        var error_area = $('#popup_feedback input[name=error_area]').is(':checked');
        var error_use = $('#popup_feedback input[name=error_use]').is(':checked');
        var error_cross = $('#popup_feedback input[name=error_cross]').is(':checked');
        var no_errors = $('#popup_feedback input[name=no_errors]').is(':checked');

        var last_name = $('#popup_feedback input[name=last_name]').val();
        var first_name = $('#popup_feedback input[name=first_name]').val();
        var middle_name = $('#popup_feedback input[name=middle_name]').val();

        var pass_series = $('#popup_feedback input[name=pass_series]').val();
        var pass_number = $('#popup_feedback input[name=pass_number]').val();
        var identification_number = $('#popup_feedback input[name=identification_number]').val();
        var phone = $('#popup_feedback input[name=phone]').val();
        var email = $('#popup_feedback input[name=email]').val();
        var addr = $('#popup_feedback input[name=addr]').val();
        var code = $('#popup_feedback input[name=code]').val();

        if (trim(cadnum) == '') {
            alert("Необхідно ввести Кадастровий номер");
            return false;
        }

        if (!is_cadnum(cadnum)) {
            alert('Кадастровий номер введений не вірно. Будь-ласка введіть кадастровий номер у вірному форматі.');
            return false;
        }

        if (trim(last_name) == '') {
            alert("Необхідно ввести Прізвище");
            return false;
        }

        if (trim(first_name) == '') {
            alert("Необхідно ввести Ім'я");
            return false;
        }

        if (trim(middle_name) == '') {
            alert("Необхідно ввести По батькові");
            return false;
        }

        if (trim(pass_series) == '' || trim(pass_number) == '') {
            alert("Необхідно ввести Серію та номер паспорта");
            return false;
        }

        if (trim(identification_number) == '') {
            alert("Необхідно ввести ІНН");
            return false;
        }

        if (trim(phone) == '') {
            alert("Необхідно ввести Телефон");
            return false;
        }

        if (trim(email) == '') {
            alert("Необхідно ввести E-mail");
            return false;
        }

        if (trim(addr) == '') {
            alert("Необхідно ввести Адресу");
            return false;
        }

        if (trim(code) == '') {
            alert("Необхідно ввести код підтвердження");
            return false;
        }

        $.ajax({
            url: '/kadastrova-karta/get-tmp',
            async: false,
            data: {
                cadnum: cadnum,
                no_parcel: no_parcel,
                no_cadnum: no_cadnum,
                error_location: error_location,
                error_configuration: error_configuration,
                error_area: error_area,
                error_use: error_use,
                error_cross: error_cross,
                no_errors: no_errors,
                last_name: last_name,
                first_name: first_name,
                middle_name: middle_name,
                pass_series: pass_series,
                pass_number: pass_number,
                identification_number: identification_number,
                phone: phone,
                email: email,
                addr: addr,
                code: code
            },
            success: function (data) {
                popup.close();
                $('#popup_feedback_form .body').html(data);
                popup.open('popup_feedback_form');
            }
        });
    });

    $('#btn_feedback_send').on('click', function () {
        $('#feedback_send_loader').show();
        $('#btn_feedback_send').attr('disabled', true);

        var id = $('input.requestid').val();
        var cadnum = $('#popup_feedback input[name=cadnum]').val();

        var no_parcel = $('#popup_feedback input[name=no_parcel]').is(':checked');
        var no_cadnum = $('#popup_feedback input[name=no_cadnum]').is(':checked');
        var error_location = $('#popup_feedback input[name=error_location]').is(':checked');
        var error_configuration = $('#popup_feedback input[name=error_configuration]').is(':checked');
        var error_area = $('#popup_feedback input[name=error_area]').is(':checked');
        var error_use = $('#popup_feedback input[name=error_use]').is(':checked');
        var error_cross = $('#popup_feedback input[name=error_cross]').is(':checked');
        var no_errors = $('#popup_feedback input[name=no_errors]').is(':checked');

        var last_name = $('#popup_feedback input[name=last_name]').val();
        var first_name = $('#popup_feedback input[name=first_name]').val();
        var middle_name = $('#popup_feedback input[name=middle_name]').val();

        var pass_series = $('#popup_feedback input[name=pass_series]').val();
        var pass_number = $('#popup_feedback input[name=pass_number]').val();
        var identification_number = $('#popup_feedback input[name=identification_number]').val();
        var phone = $('#popup_feedback input[name=phone]').val();
        var email = $('#popup_feedback input[name=email]').val();
        var addr = $('#popup_feedback input[name=addr]').val();
        var code = $('#popup_feedback input[name=code]').val();

        $.ajax({
            url: '/kadastrova-karta/submit-app',
            dataType: 'json',
            async: false,
            data: {
                id: id,
                cadnum: cadnum,
                no_parcel: no_parcel,
                no_cadnum: no_cadnum,
                error_location: error_location,
                error_configuration: error_configuration,
                error_area: error_area,
                error_use: error_use,
                error_cross: error_cross,
                no_errors: no_errors,
                last_name: last_name,
                first_name: first_name,
                middle_name: middle_name,
                pass_series: pass_series,
                pass_number: pass_number,
                identification_number: identification_number,
                phone: phone,
                email: email,
                addr: addr,
                code: code
            },
            success: function (data) {
                $('#feedback_send_loader').hide();
                $('#btn_feedback_send').attr('disabled', false);

                if (data['status']) {
                    alert(data['msg']);
                    $('.editlist input[type=text]').val('');
                    $('.editlist input[type=checkbox]').attr('checked', false);
                    $('#btn_feedback_send').attr('disabled', true);
                    popup.close();
                } else {
                    alert(data['msg']);
                }
            }
        });
    });

    /**
     * Відкрити форму для замовлення витягу
     */
    $('.open_request_excerpt').on('click', function (event) {
        var cadnum = $(this).data('cadnum');

        $.fancybox.open({
            href: '/excerpt/excerpt-form?cadnum=' + cadnum,
            type: 'iframe'
        });
    });

    /**
     * Вибір між фізичною і юридичною особами
     */
    $('#request_excerpt select[name=type_user_choice]').change(function (event) {
        var typeUser = $(this).val();

        switch (typeUser) {
            case 'civil': // фізична особа
                $('#request_excerpt .juridical_person').hide();
                $('#request_excerpt .physical_person').show();
                $('#request_excerpt .physical_person select').attr('disabled', false);
                $('#request_excerpt .physical_person input').attr('disabled', false);
                $('#request_excerpt .juridical_person select').attr('disabled', true);
                $('#request_excerpt .juridical_person input').attr('disabled', true);
                break;
            case 'legal': // юридична особа
                $('#request_excerpt .physical_person').hide();
                $('#request_excerpt .juridical_person').show();
                $('#request_excerpt .juridical_person select').attr('disabled', false);
                $('#request_excerpt .juridical_person input').attr('disabled', false);
                $('#request_excerpt .physical_person select').attr('disabled', true);
                $('#request_excerpt .physical_person input').attr('disabled', true);
                break;
        }
    });

    /**
     * Замовити витяг
     */
    $('#btn_request_excerpt_feedback').click(function (event) {
        $.ajax({
            url: '/kadastrova-karta/excerpt',
            dataType: 'json',
            data: {
                'captcha': $('#request_excerpt input[name=captcha]').val()
            },
            success: function (data) {
                if (data['success']) {

                    $('#request_excerpt input[name=captcha]').attr('disabled', true);
                    $serialized_form_data = $("#request_excerpt_form").serialize();
                    $('#request_excerpt input[name=captcha]').attr('disabled', false);

                    $.ajax({
                        url: '/ajax/create-excerpt', //$('#eservice_api_excerpt_uri').val(),
                        type: 'POST',
                        data: {
                            form: $serialized_form_data
                        },
                        dataType: 'json',
                        success: function (data, status) {
                            if (data['status'] == 'success') {
                                popup.close();
                                request_excerpt_clean_errors();
                                $('#request_excerpt_success .request_excerpt_success_cadnum').text($('#request_excerpt input[name=cadNum]').val());
                                $('#request_excerpt_success .request_excerpt_success_request_num').text(data['request_num']);
                                $('#request_excerpt_success .request_excerpt_success_date').text(new Date(data['date']).format('dd.mm.yyyy HH:MM:ss'));
                                $('#payment_url').attr('href', data['redirect_url']);
                                popup.open('request_excerpt_success');
                            } else {
                                $('#request_excerpt input[name=captcha]').val('');
                                refreshCaptcha();

                                if (data['message'] !== undefined) {
                                    alert(JSON.parse(data['message']));
                                } else {
                                    alert("Виникла помилка. Перевірте чи вірно заповнені поля форми.");
                                    request_excerpt_show_errors(data['errors']);
                                }
                            }
                        }
                    });
                } else {
                    alert(data['msg']);
                    $('#request_excerpt input[name=captcha]').val('');
                    refreshCaptcha();
                }
            }
        });
    });


    $("#cnap_region").change(function () {
        $("#cnap_name").load("/ajax/cnaps-list/", {
            'id': $("#cnap_region option:selected").val()
        },
            function () {
                if ($("#cnap_region option:selected").val() > 0) {
                    $("#cnap_name").attr("disabled", false);
                    show_cnap_address();
                } else {
                    $("#cnap_name").attr("disabled", true);
                    show_cnap_address();
                }

            });
    });

    $("#cnap_name").change(function () {
        show_cnap_address();
    });


    /**
     * Відкрити форму для замовлення витягу грошової оцінки
     */
    $('.open_request_valuation').on('click', function (event) {
        var cadnum = $(this).data('cadnum');
        var idOffice = $(this).data('id-office');

        $.fancybox.open({
            href: '/monetary-evaluation/request-form?cadnum=' + cadnum + '&id_office=' + idOffice,
            type: 'iframe'
        });
    });


    /**
     * Шари намірів, відомості
     */
    $('.open_land_disposal').on('click', function (event) {
        var extNumber = $(this).data('excerpt');

        $.fancybox.open({
            href: '/land-disposal/intentions-info?ext_number=' + extNumber,
            type: 'iframe'
        });
    });

    /**
     * Земельна ділянка, викопіювання, відомості
     */
    $('.open_parcel_land_disposal').on('click', function (event) {
        var extNumber = $(this).data('excerpt');

        $.fancybox.open({
            href: '/land-disposal/parcel-info?ext_number=' + extNumber,
            type: 'iframe'
        });
    });

    /*
	//plugin for new 2016 year // shared 20012016 
	$().jSnow({
        zIndex: 750,
        flakeCode: ["&#10052;"]
    });*/
});

var refreshCaptchaID = 1;
function refreshCaptcha() {
    $('.captcha').attr('src', '/auth/captcha/' + refreshCaptchaID);
    refreshCaptchaID += 1;
}

function request_excerpt_show_errors(errors) {
    request_excerpt_clean_errors();

    console.log(errors);

    $.each(errors['form']['children'], function (key, value) {
        if ($.isPlainObject(value)) {
            switch (key) {
                case 'cnapId':
                    var error_msg = '';

                    for (var i = 0; i < value['errors'].length; i++) {
                        error_msg += value['errors'][i];

                        if (i < (value['errors'].length - 1)) {
                            error_msg += '<br />';
                        }
                    }

                    $('#request_excerpt .request_excerpt_field_' + key + ' p').removeClass('error_off').html(error_msg);
                    $('#request_excerpt .request_excerpt_field_' + key).addClass('error_on');
                    break;
            }
        }
    });

    $.each(errors['form']['children']['type_user']['children'], function (key, value) {
        if ($.isPlainObject(value)) {
            switch (key) {
                case 'email':
                case 'lname':
                case 'fname':
                case 'mname':
                case 'orgName':
                case 'inn':
                case 'edrpou':
                case 'tel':
                case 'accept':
                case 'address':
                    var error_msg = '';

                    for (var i = 0; i < value['errors'].length; i++) {
                        error_msg += value['errors'][i];

                        if (i < (value['errors'].length - 1)) {
                            error_msg += '<br />';
                        }
                    }

                    $('#request_excerpt .request_excerpt_field_' + key + ' p').removeClass('error_off').html(error_msg);
                    $('#request_excerpt .request_excerpt_field_' + key).addClass('error_on');
                    break;
                case 'document':
                    $.each(value['children'], function (key, value) {
                        if ($.isPlainObject(value)) {
                            switch (key) {
                                case 'dateIssue':
                                case 'number':
                                case 'series':
                                    var error_msg = '';

                                    for (var i = 0; i < value['errors'].length; i++) {
                                        error_msg += value['errors'][i];

                                        if (i < (value['errors'].length - 1)) {
                                            error_msg += '<br />';
                                        }
                                    }

                                    $('#request_excerpt .request_excerpt_field_' + key + ' p').removeClass('error_off').html(error_msg);
                                    $('#request_excerpt .request_excerpt_field_' + key).addClass('error_on');
                                    break;
                            }
                        }
                    });
                    break;
            }

            var errorElements = $('#request_excerpt li.error_on');

            if (errorElements.length > 0) {
                var input = $(errorElements[0]).find('input');
                var textarea = $(errorElements[0]).find('textarea');

                if (input.length > 0) {
                    $(input).focus();
                } else {
                    $(textarea).focus();
                }
            }

        }
    });
}

function request_excerpt_clean_errors() {
    $('#request_excerpt li p.request_excerpt_popup_error').addClass('error_off');
    $('#request_excerpt li').removeClass('error_on');
}


function show_cnap_address() {
    $("#cnap_address").load("/ajax/cnap-address/", {
        'id': $("#cnap_name").val()
    });
}
