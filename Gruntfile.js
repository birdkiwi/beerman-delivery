module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: ["css"]
                },
                files: {"build/style.css": "less/style.less"}
            },
            production: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {"build/style.css": "less/style.less"}
            }
        },

        cssmin: {
            combine: {
                files: {
                    'build/style.min.css': ['build/style.css']
                }
            }
        },

        concat: {
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/typeahead.js/dist/typeahead.jquery.js',
                    'bower_components/jquery.inputmask/dist/jquery.inputmask.bundle.js',
                    'bower_components/jquery-validate/dist/jquery.validate.js',
                    'bower_components/fotorama/fotorama.js',
                    'bower_components/jquery.countdown/dist/jquery.countdown.js',
                    'bower_components/jquery-animatenumber/jquery.animateNumber.js',
                    'bower_components/spin.js/spin.js',
                    'bower_components/spin.js/jquery.spin.js',
                    'bower_components/Stickyfill/dist/stickyfill.js',
                    'bower_components/jquery-simple-datetimepicker/jquery.simple-dtpicker.js',
                    'bower_components/nanoscroller/bin/javascripts/jquery.nanoscroller.js',
                    'bower_components/modernizr/modernizr.js',
                    'js/mobile-menu.js',
                    'js/cart-mobile.js',
                    'js/script.js'
                ],
                dest: 'build/script.js'
            }
        },

        uglify: {
            build: {
                src: 'build/script.js',
                dest: 'build/script.min.js'
            }
        },

        sprite:{
            less: {
                src: 'images/sprites/*.png',
                dest: 'build/spritesheet.png',
                destCss: 'build/sprites-vars.less'
            },
            css: {
                src: 'images/sprites/*.png',
                dest: 'build/spritesheet.png',
                destCss: 'build/sprites.less',
                cssFormat: 'css',
                cssOpts: {
                    cssSelector: function (item) {
                        if (item.name.indexOf('-hover') !== -1) {
                            return '.bm-' + item.name.replace('-hover', ':hover');
                        } else if (item.name.indexOf('-active') !== -1) {
                            return '.bm-' + item.name.replace('-active', ':active');
                        }
                        return '.bm-' + item.name;
                    }
                }
            }
        },

        watch: {
            scripts: {
                files: ['js/**/*.js', 'images/sprites/*', 'less/**/*.less'],
                tasks: ['sprite', 'less', 'cssmin', 'concat', 'uglify'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['sprite', 'less', 'cssmin', 'concat', 'uglify', 'watch']);

};