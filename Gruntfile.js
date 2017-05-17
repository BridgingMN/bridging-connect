module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                src: ['client/scripts/*.js',
                    'client/scripts/**/*.js'
                ],
                dest: 'server/public/scripts/client.min.js'
            }
        },
        copy: {
            html: {
                expand: true,
                cwd: 'client/views',
                src: ['index.html',
                    '**/*.html'
                ],
                dest: 'server/public/views/'
            },
            css: {
                expand: true,
                cwd: 'client/styles',
                src: ['style.css'],
                dest: 'server/public/styles/'
            },
            moment: {
                expand: true,
                cwd: 'node_modules/moment/',
                src: ['moment.js'],
                dest: 'server/public/vendors/moment/'
            },
            angular: {
                expand: true,
                cwd: 'node_modules/angular/',
                src: ['angular.js',
                    'angular.min.js',
                    'angular.min.js.map'
                ],
                dest: 'server/public/vendors/angular/'
            },
            angularRoute: {
                expand: true,
                cwd: 'node_modules/angular-route/',
                src: ['angular-route.js',
                    'angular-route.min.js',
                    'angular-route.min.js.map'
                ],
                dest: 'server/public/vendors/angular-route/'
            },
            angularMaterial: {
                expand: true,
                cwd: 'node_modules/angular-material/',
                src: ['**.*'],
                dest: 'server/public/vendors/angular-material/'
            },
            angularAnimate: {
                expand: true,
                cwd: 'node_modules/angular-animate/',
                src: ['**.*'],
                dest: 'server/public/vendors/angular-animate/'
            },
            angularAria: {
                expand: true,
                cwd: 'node_modules/angular-aria/',
                src: ['**.*'],
                dest: 'server/public/vendors/angular-aria/'

            },
            angularMaterialDataTable: {
              expand: true,
              cwd: 'node_modules/angular-material-data-table/dist',
              src: ['**.*'],
              dest: 'server/public/vendors/angular-material-data-table'
            }
        },
        watch: {
            save: {
                files: ['client/**/*.*'],
                tasks: ['uglify', 'copy']
            },
            refresh: {
                files: ['server/public/scripts/*.js', 'server/public/stylesheets/*.css', 'server/public/views/*.html', 'server/public/vendors/*.*'],
                options: {
                    livereload: true
                }
            }
        },
        apidoc: {
          myapp: {
            src: 'server/',
            dest: 'apidoc/',
            options: {
              debug: false,
              includeFilters: [ '.*\.js$' ],
              excludeFilters: [ 'node_modules/' ]
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-apidoc');

    grunt.registerTask('default', ['uglify', 'copy', 'apidoc', 'watch']);
};
