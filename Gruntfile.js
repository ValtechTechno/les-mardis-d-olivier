/*jslint node: true */
"use strict";


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js' ],
      options: {
        jshintrc:true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

};
