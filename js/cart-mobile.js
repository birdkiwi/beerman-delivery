(function( $ ) {
    $.fn.cartMenu = function() {

        function toggleCart() {

            var overlay = $('.body-overlay');

            function hideEvent(e) {
                if(!$(e.target).closest('.main-sidebar').length) {
                    hideCart();
                    $(document).off('click', 'body', hideEvent);
                }
            }

            function showCart() {
                $('.main-sidebar').addClass('active');

                $('body').addClass('is-menu-moved-right');
                overlay.addClass('active');

                $(document).on('click', 'body', hideEvent);
            }

            function hideCart() {
                $('.main-sidebar').removeClass('active');

                $('body').removeClass('is-menu-moved-right');
                overlay.removeClass('active');
            }

            if ($('.main-sidebar').hasClass('active')) {
                hideCart();
            } else {
                showCart();
            }
        }

        $(document).on('click', '.js-mobile-cart', function() {
            toggleCart();
            return false;
        });
    };
})(jQuery);

