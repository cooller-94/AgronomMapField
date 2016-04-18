
jQuery.fn.clickCarousel = function () {
    //Определяем ширину каждой вкладки
    var widthTabs = {
        a_dilanka: 70,
        a_ikk: 34,
        a_rajonunion: 55,
        a_obl: 69,
        a_land_disposal: 111
    };

    jQuery('#carouselLeft').click(function () {

        var tabs = jQuery("ul#container").children();
        var widthAllElements = 0;

        tabs.each(function () {
            var widthElement = 0;
            if (!jQuery(this).is(':hidden')) {
                widthElement = jQuery(this).width();
                widthAllElements += widthElement + 5;
            }
        });

        if (jQuery('#container').width() < (widthAllElements) + 5) {
            var idTab = '';
            var widthHideTab = 0;
            tabs.each(function () {
                if ((jQuery(this).attr('class') != 'hideTab') && (jQuery(this).width() != 0)) {
                    jQuery(this).addClass('hideTab').hide();
                    idTab =jQuery(this).children().attr('id');
                    widthHideTab = widthTabs[idTab];
                    return false;
                }
            });
            tabs.each(function () {
                var widthTab = 0;

                if (jQuery(this).attr('class') != 'hideTab' && (jQuery(this).width() != 0)) {
                    var leftEl = parseInt(jQuery(this).css('left'), 10);
                    widthTab = widthTabs[idTab];
                    var leftAnimate = leftEl - widthTab;
                    jQuery(this).animate({"left": (leftAnimate)-5 + 'px'}, 300);
                    jQuery('#carouselRight').css({"opacity":1});
                }
            });
            if (jQuery('#container').width() > ((widthAllElements) + 5-widthHideTab)){
                jQuery('#carouselLeft').css({"opacity":0});
            }
        }

    });

    jQuery('#carouselRight').click(function () {
            var idTab = '';
            var tabs = jQuery("ul#container").children();

            var arrayHideEl = [];
            tabs.each(function () {
                if (jQuery(this).hasClass('hideTab')) {
                    arrayHideEl.push(jQuery(this));
                }
            });
            if (arrayHideEl != '') {
                var leftElement = 0;
                console.log(arrayHideEl.length);
                tabs.each(function () {
                    if ((!jQuery(this).hasClass('hideTab')) && (jQuery(this).css('left') != 'auto')) {
                        leftElement = parseInt((jQuery(this).css('left')),10);
                        idTab = $(arrayHideEl[arrayHideEl.length - 1]).children().attr('id');
                        jQuery(this).animate({"left": (widthTabs[idTab] + leftElement+5) + 'px'}, 300);
                        jQuery('#carouselLeft').css({"opacity":1});
                    }
                });

                if (arrayHideEl.length == 1){
                    jQuery('#carouselRight').css({"opacity":0});
                }
                jQuery(arrayHideEl[arrayHideEl.length - 1]).attr('class','').delay(300).show(0);
            }

        });
    }













