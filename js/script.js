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
        var button = $(this);
        var quantityInput = button.siblings('input[name=quantity]');
        var quantity = quantityInput.val();
        var quantityBlock = '<div class="bm-quantity-changer">' +
            '<span class="bm-quantity-changer-minus" data-quantity-change="minus"></span>' +
            '<input type="text" pattern="[0-9.]+" class="bm-quantity-changer-input" data-quantity-input value="' + quantity + '">' +
            '<span class="bm-quantity-changer-plus" data-quantity-change="plus"></span>' +
            '</div>';

        if (quantity > 0) {
            button.html('');
            button.append(quantityBlock);
            button.addClass('is-active');
        } else {
            $(this).on('click', function() {
                if (!button.attr('disabled')) {
                    ++quantity;
                    quantityInput.val(quantity);
                    initBuyButtons($(this));
                }

                $(this).unbind('click');

                return false;
            });
        }
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

$(document).on('click', '[data-quantity-input]', function() {
    if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(this).parent().addClass('is-input-active');
        $(this).select();

        $(this).on('blur', function(){
            $(this).removeClass('active');
            $(this).parent().removeClass('is-input-active');
        });
    }
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
    });

    return false;
});

$(document).on('click', '[data-quantity-change]', function() {
    var operator = $(this).data('quantity-change');
    var quantityInput = $(this).siblings('[data-quantity-input]');
    var currentQuantity = +quantityInput.val();

    if (operator == 'plus') {
        quantityInput.val(currentQuantity+1);
    } else if (operator == 'minus') {
        if (currentQuantity > 0) {
            quantityInput.val(currentQuantity-1);
        }
    }
});

$(document).ready(function(){
    countDownInit( $('[data-countdowntimer]') );
    animateNumberInit( $('[data-animate-number]') );
    initBuyButtons( $('[data-buy-button]') );
    initQuantityChangers( $('[data-quantity-changer]') );
    initContentModal();

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
});

$('.js-fotorama').on('fotorama:show', function (e, fotorama) {
    countDownInit( $(fotorama.activeFrame.html).find('[data-countdown-fotorama]') );
});