/*jslint node: true */
"use strict";


module.exports = function (grunt) {

  var appConfig = {
    app: 'app/',
    dist: 'dist/'
  };

  grunt.initConfig({

    appConfig: appConfig,

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [ 'Gruntfile.js', 'app/{,*/}*.js'],
      options: {
        jshintrc: true
      }
    },
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['index.css']
      }
    },

    htmllint: {
      dist: {
        options: {
          path: false,
          reportpath: false
        },
        src: ['index.html', 'app/{,*/}*.html']
      }
    },

    concat: {
      css:{
        src: [
            "lib/foundation-5.5.1/css/foundation.min.css",
            "lib/jquery-ui-1.11.0.custom/jquery-ui.min.css",
            "lib/angularjs-toaster-0.4.14/toaster.min.css",
            "lib/treasure-overlay-spinner/treasure-overlay-spinner.min.css",
            "lib/angular-bootstrap-calendar/angular-bootstrap-calendar.min.css",
            "index.css"
        ],
        dest: 'dist/assets/script.css'
      },
      js: {
        options: {
          stripBanners: {
            all: true,
            block : true
            //line : true
          },
          banner: '(function () {',
          footer: '})();',
          separator: '})();(function () {'
        },
        src: [
          "lib/foundation-5.5.1/js/vendor/modernizr.js",
          "lib/foundation-5.5.1/js/vendor/jquery.js",
          "lib/jquery-ui-1.11.0.custom/jquery-ui.min.js",
          "lib/jquery-ui-1.11.0.custom/ui/i18n/datepicker-fr.js",
          "lib/angular-1.4.3/angular.min.js",
          "lib/angular-1.4.1/angular-animate.min.js",
          "lib/angular-1.4.1/angular-route.min.js",
          "lib/angular-1.4.3/angular-touch.min.js",
          "lib/angular-ui-date-0.0.8/date.js",
          "lib/foundation-5.5.1/js/foundation.min.js",
          "lib/filesaver/FileSaver.min.js",
          "lib/angularjs-toaster-0.4.14/toaster.min.js",
          "lib/translate/angular-translate.min.js",
          "lib/translate/angular-translate-loader-static-files.min.js",
          "lib/translate/angular-messages.min.js",
          "lib/angular-http-auth/http-auth-interceptor.js",
          "lib/angular-local-storage/angular-local-storage.min.js",
          "lib/pouchdb/pouchdb.min.js",
          "lib/angular-uuid/angular-uuid.js",
          "lib/treasure-overlay-spinner/treasure-overlay-spinner.min.js",
          "lib/angular-bootstrap-calendar/moment.min.js",
          "lib/angular-bootstrap-calendar/angular-bootstrap-calendar-tpls.min.js",
          "lib/angular-bootstrap-calendar/fr.js",
          "app/mardisDOlivier.module.js",
          "app/datePicker.filter.js",
          "app/error.config.js",
          "app/route.config.js",
          "app/translate.config.js",
          "app/menu.controller.js",
          "app/widget/popup/popupDirective.js",
          "app/association/association.controller.js",
          "app/antenne/antenne.controller.js",
          "app/about/about.controller.js",
          "app/about/about.edit.controller.js",
          "app/beneficiaire/beneficiaire.controller.js",
          "app/beneficiaire/beneficiaireDetail.controller.js",
          "app/benevole/benevole.controller.js",
          "app/benevole/benevoleDetail.controller.js",
          "app/benevole/benevoleCreate.controller.js",
          "app/data/data.service.js",
          "app/distribution/distribution.controller.js",
          "app/distribution/distributionDetail.controller.js",
          "app/export/export.controller.js",
          "app/import/import.controller.js",
          "app/common.service.js",
          "app/login/login.service.js",
          "app/login/login.controller.js",
          "app/benevole/join.controller.js",
          "app/family/family.controller.js",
          "app/family/familyDetail.controller.js",
          "app/activities/activities.service.js",
          "app/activities/activitiesAdmin.controller.js",
          "app/activities/activitiesResp.controller.js",
          "app/activities/activitiesMember.controller.js",
          "app/antenne/antenneAdmin.controller.js",
          "app/homepage/homepage.controller.js"
        ],
        dest: 'dist/script.js'
      },
      jscrypto: {
        src: [ "lib/angularjs-crypto/sha256.min.js", "dist/script.js" ],
        dest: 'dist/script.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        compress: true,
        except: ['jQuery']
      },
      build: {
        src: '<%= appConfig.dist %>/script.js',
        dest: '<%= appConfig.dist %>/script.min.js'
      }
    },
    watch: {
      files: ['app/{,*/}*.js', 'app/{,*/}*.html', 'fr_FR.json', 'index.css', 'index.html'],
      tasks: ['build']
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp/**/*',
              '<%= appConfig.dist %>/{,*/}*',
              '!<%= appConfig.dist %>/.git{,*/}*'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= appConfig.dist %>/app/{,*/}*.js',
          '<%= appConfig.dist %>/assets/styles/{,*/}*.css'
//          '<%= appConfig.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['index.html'],
      options: {
        dest: '<%= appConfig.dist %>',
        flow: {
          html: {
            steps: {
              //js: ['uglifyjs'],
              //css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= appConfig.dist %>/index.html', '<%= appConfig.dist %>/{,*/}*.html'],
      css: ['<%= appConfig.dist %>/assets/{,*/}*.css'],
      js: ['<%= appConfig.dist %>/app/{,*/}*.js'],
      options: {
        assetsDirs: ['<%= appConfig.dist %>', '<%= appConfig.dist %>/assets/images']
      }
    },

    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            src: '<%= appConfig.dist %>/app/{,*/}*.js',
            dest: ''
          }
        ]
      }
    },

    cssmin: {
      css:{
        src: '<%= appConfig.dist %>/assets/script.css',
        dest: '<%= appConfig.dist %>/assets/script.min.css'
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true,
          keepClosingSlash: true,
          removeComments: true
        },
        files: [
          {
            expand: true,
            src: ['<%= appConfig.dist %>/index.html', '<%= appConfig.dist %>/app/{,*/}*/*.html'],
            dest: ''
          }
        ]
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            dest: '<%= appConfig.dist %>',
            src: [
              'index.html', 'fr_FR.json.js', '<%= appConfig.app %>/{,*/}*/*.html',
              'lib/jquery-ui-1.11.0.custom/images/*.*',
              "lib/foundation-5.5.1/js/vendor/modernizr.js",
              "lib/foundation-5.5.1/js/vendor/jquery.js",
              "lib/jquery-ui-1.11.0.custom/jquery-ui.min.js",
              "lib/jquery-ui-1.11.0.custom/ui/i18n/datepicker-fr.js",
              "lib/angular-1.4.3/angular.min.js",
              "lib/angular-1.4.1/angular-animate.min.js",
              "lib/angular-1.4.1/angular-route.min.js",
              "lib/angular-1.4.3/angular-touch.min.js",
              "lib/angular-ui-date-0.0.8/date.js",
              "lib/foundation-5.5.1/js/foundation.min.js",
              "lib/filesaver/FileSaver.min.js",
              "lib/angularjs-toaster-0.4.14/toaster.min.js",
              "lib/translate/angular-translate.min.js",
              "lib/translate/angular-translate-loader-static-files.min.js",
              "lib/translate/angular-messages.min.js",
              "lib/angular-http-auth/http-auth-interceptor.js",
              "lib/angular-local-storage/angular-local-storage.min.js",
              "lib/pouchdb/pouchdb.min.js",
              "lib/angular-uuid/angular-uuid.js",
              "lib/angularjs-crypto/CryptoJSCipher.js",
              "lib/angularjs-crypto/angularjs-crypto.js",
              "lib/angularjs-crypto/sha256.min.js",
              "lib/treasure-overlay-spinner/treasure-overlay-spinner.min.js",
              "lib/angular-bootstrap-calendar/moment.min.js",
              "lib/angular-bootstrap-calendar/angular-bootstrap-calendar-tpls.min.js",
              "lib/angular-bootstrap-calendar/fr.js",
              '<%= appConfig.app %>/{,*/}*/*.js'
            ]
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            src: 'fonts/*',
            dest: '<%= appConfig.dist %>/assets/'
          }
        ]
      }
    },
    imagemin: {
      static: {
        files: {
          'dist/assets/images/les-mardis-d-olivier.png': 'images/les-mardis-d-olivier.png',
          'dist/assets/images/favicon-32x32.png': 'images/favicon-32x32.png',
          'dist/assets/images/favicon-32x32.ico': 'images/favicon-32x32.ico',
          'dist/assets/images/ui-icons_222222_256x240.png': 'lib/jquery-ui-1.11.0.custom/images/ui-icons_222222_256x240.png',
          'dist/assets/images/ui-bg_flat_75_ffffff_40x100.png': 'lib/jquery-ui-1.11.0.custom/images/ui-bg_flat_75_ffffff_40x100.png'
        }
      }
    },
    imageEmbed: {
      dist: {
        src: '<%= appConfig.dist %>/assets/script.css',
        dest: '<%= appConfig.dist %>/assets/script.css'
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'ngmin',
    'concat:css',
    'concat:js',
    'concat:jscrypto',
    'uglify',
    'useminPrepare',
    'imagemin:static',
    'imageEmbed',
    'cssmin',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-image-embed');
};
