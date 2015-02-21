function countDownInit(element) {
    // Countdown timer. Example: <div data-countdown-timer data-countdown-finaldate="2016/01/01"></div>
    element.each(function() {
        var $this = $(this), finalDate = $(this).data('countdown-finaldate');
        $this.countdown(finalDate, function(event) {
            $this.html(event.strftime('%H:%M:%S'));
        });
    });
}

function animateNumberInit(element) {
    element.each(function() {
        var number = $(this).data('animate-number');
        var speed = $(this).data('animate-number-speed') || 1000;
        $(this).animateNumber({number: number}, speed);
    });
}

function initBuyButtons(element) {
    element.each(function(){
        var button = $(this),
            form = button.parent(),
            maxQuantity = +button.data('buy-button-max-quantity'),
            quantityInput = button.find('[data-quantity-input]'),
            quantity = quantityInput.val(),
            quantityButtons = button.find('[data-quantity-change]'),
            overlay = button.closest('.bm-product-card').find('.bm-product-card-spin-overlay');

        quantityInput.click(function() {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $(this).parent().addClass('is-input-active');
                $(this).select();

                $(this).on('blur', function() {
                    $(this).removeClass('active');
                    $(this).parent().removeClass('is-input-active');
                });
            }

            return false;
        });

        quantityButtons.click(function() {
            var operator = $(this).data('quantity-change');
            var quantity = +quantityInput.val();

            if (operator == 'plus') {
                quantityInput.val(quantity+1).change();
            } else if (operator == 'minus') {
                quantityInput.val(quantity-1).change();
            }

            return false;
        });

        quantityInput.on('change', function() {
            var currentQuantity = isNaN($(this).val()) ? 1 : Number($(this).val());
            if (currentQuantity > maxQuantity) {
                quantityInput.val(maxQuantity);
                $('#max-quantity-warning').modal();
            } else {
                quantityInput.val(currentQuantity);
            }

            if (currentQuantity <= 0) {
                $(this).val(0);
                button.removeClass('is-active').on('click', prepareButton);
            } else {
                button.addClass('is-active');
            }

            overlay.addClass('is-active');
            overlay.spin('large');

            //AJAX CALL HERE
            setTimeout(function(){
                overlay.removeClass('is-active');
                overlay.spin('stop');
            }, 500);
        });

        form.on('submit', function() {
            return false;
        });

        function prepareButton() {
            quantityInput.val(1);
            $(this).unbind('click');
            quantityInput.trigger('change');
            return false;
        }

        if (quantity > 0) {
            button.addClass('is-active');
        } else {
            button.on('click', prepareButton);
        }
    });
}

function bodyLoadSpin(action) {
    overlay = $('.body-overlay');
    if (action == 'start') {
        overlay.addClass('active');
        overlay.spin({
            color: "#fff",
            lines: 10,
            length: 15
        });
    } else if (action == 'stop') {
        overlay.spin('stop');
        overlay.removeClass('active');
    }
}

function initTypeahead(element) {
    element.each(function(){
        var substringMatcher = function(strs) {
            return function findMatches(q, cb) {
                var matches, substrRegex;
                // an array that will be populated with substring matches
                matches = [];
                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strs, function(i, str) {
                    if (substrRegex.test(str)) {
                        // the typeahead jQuery plugin expects suggestions to a
                        // JavaScript object, refer to typeahead docs for more info
                        matches.push({ value: str });
                    }
                });
                cb(matches);
            };
        };

        var dataUrl = element.data('typeahead');

        $.ajax({
            url: dataUrl,
            cache: false,
            contentType: "application/json"
        }).done(function( data ) {
            if (data) {
                element.typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        name: 'data',
                        displayKey: 'value',
                        source: substringMatcher(data)
                    });
            }
        });
    });
}

function initQuantityChangers(element) {
    element.each(function(){
        var input = $(this).find('input');
        var plusButton = $(this).find('[data-quantity-changer-plus]');
        var minusButton = $(this).find('[data-quantity-changer-minus]');

        plusButton.click(function() {
            var currentVal = +input.val();
            console.log(currentVal);
            input.val(currentVal+1);
        });

        minusButton.click(function() {
            var currentVal = +input.val();
            console.log(currentVal);
            if (currentVal > 0) {
                input.val(currentVal-1);
            }
        });

        input.click(function() {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                $(this).parent().addClass('is-input-active');
                $(this).select();

                $(this).on('blur', function(){
                    $(this).removeClass('active');
                    $(this).parent().removeClass('is-input-active');
                });
            }
        })
    });
}

function initContentModal() {
    $('.main-content').append('<div class="main-content-modal"><div class="main-content-modal-inner"></div></div>');
    $('.main-content-modal').height($(window).height() - 80);
    $('.main-content-modal').css('top', $(window).scrollTop());
    $('.main-content-modal').append('<a class="main-content-modal-close">');

    $('.main-content-modal-close').on('click', function(){
        $('.main-content-modal').fadeOut();
    });
}

$(window).on('scroll resize', function() {
    $('.main-content-modal').height($(window).height() - 80);
    $('.main-content-modal').css('top', function(){
        return $(window).scrollTop()
    });
});

$(document).on('click', '[data-load-product-card]', function() {
    $('.main-content-modal').fadeIn();
    $('.main-content-modal').spin('large');

    $.ajax({
        url: "product-1.html",
        cache: false
    }).done(function(data){
        $(data).find('[data-buy-button]');
        $('.main-content-modal').spin(false);
        $('.main-content-modal-inner').html(data);
        initBuyButtons( $('.main-content-modal').find('[data-buy-button]') );
    });

    return false;
});

$(document).ready(function(){
    countDownInit( $('[data-countdowntimer]') );
    animateNumberInit( $('[data-animate-number]') );
    initBuyButtons( $('[data-buy-button]') );
    initQuantityChangers( $('[data-quantity-changer]') );
    initContentModal();
    initTypeahead( $('[data-typeahead]') );

    $('.js-sticky').Stickyfill();
    $('.js-fotorama').fotorama();

    $(".js-nano").nanoScroller({
        paneClass: 'js-nano-pane',
        sliderClass: 'js-nano-slider',
        contentClass: 'js-nano-content'
    });

    $(".js-validate").each(function(){
        $(this).validate({
            errorPlacement: function(error, element) {},
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            }
        });
    });

    $('[data-masked-input]').each(function(){
        var mask = $(this).data('masked-input');
        $(this).inputmask(mask);
    });

    $('[data-tab]').click(function() {
        var element = $(this).attr('href');
        var group = $(this).data('tab');

        $('[data-tab="' + group + '"]').removeClass('active');
        $(this).addClass('active');
        $(group).removeClass('active');
        $(element).addClass('active');

        console.log($(element));
        if ($(element).hasClass('js-nano')) {
            $(element).nanoScroller({
                paneClass: 'js-nano-pane',
                sliderClass: 'js-nano-slider',
                contentClass: 'js-nano-content'
            });
        }

        return false;
    });

    $('[data-date-input]').each(function() {
        $(this).appendDtpicker({
            "locale": "ru",
            "closeOnSelected": true,
            "firstDayOfWeek": 1,
            'minuteInterval' : 30,
            "futureOnly": true,
            "minTime":"08:30",
            "maxTime":"19:15",
            "calendarMouseScroll": false,
            "autodateOnStart": true
        });
    });

    // CENTERED MODALS
    // phase one - store every dialog's height
    $('.modal').each(function () {
        var t = $(this),
            d = t.find('.modal-dialog'),
            fadeClass = (t.is('.fade') ? 'fade' : '');
        // render dialog
        t.removeClass('fade')
            .addClass('invisible')
            .css('display', 'block');
        // read and store dialog height
        d.data('height', d.height());
        // hide dialog again
        t.css('display', '')
            .removeClass('invisible')
            .addClass(fadeClass);
    });
    // phase two - set margin-top on every dialog show
    $('.modal').on('show.bs.modal', function () {
        var t = $(this),
            d = t.find('.modal-dialog'),
            dh = d.data('height'),
            w = $(window).width(),
            h = $(window).height();
        // if it is desktop & dialog is lower than viewport
        // (set your own values)
        if (w > 380 && (dh + 60) < h) {
            d.css('margin-top', Math.round(0.96 * (h - dh) / 2));
        } else {
            d.css('margin-top', '');
        }
    });
});

$('.js-fotorama').on('fotorama:show', function (e, fotorama) {
    countDownInit( $(fotorama.activeFrame.html).find('[data-countdown-fotorama]') );
});