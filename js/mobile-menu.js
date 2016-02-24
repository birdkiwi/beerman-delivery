(function( $ ) {
    $.fn.mobileMenu = function() {

        function toggleMobileMenu() {

            var overlay = $('.body-overlay');

            function hideEvent(e) {
                if(!$(e.target).closest('.mobile-menu').length) {
                    hideMobileMenu();
                    $(document).off('click', 'body', hideEvent);
                }
            }

            function showMobileMenu() {
                $('.mobile-menu').addClass('active');

                $('[data-menu-toggler]').addClass('active');
                $('.main-header-menu-toggler-bars').addClass('rotate');
                $('.main-header-menu-toggler-close').addClass('active');

                $('body').addClass('is-menu-moved-left no-scroll');

                overlay.addClass('active');

                $(document).on('click', 'body', hideEvent);
            }

            function hideMobileMenu() {
                $('.mobile-menu').removeClass('active');

                $('[data-menu-toggler]').removeClass('active');
                $('.main-header-menu-toggler-bars').removeClass('rotate');
                $('.main-header-menu-toggler-close').removeClass('active');

                $('body').removeClass('is-menu-moved-left');

                setTimeout(function(){
                    $('body').removeClass('no-scroll');
                }, 1000);

                overlay.removeClass('active');
            }

            if ($('.mobile-menu').hasClass('active')) {
                hideMobileMenu();
            } else {
                showMobileMenu();
            }
        }

        $(document).on('click', '[data-menu-toggler]', function() {
            toggleMobileMenu();
            return false;
        });
    };
})(jQuery);

