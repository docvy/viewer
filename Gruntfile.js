module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: {
      dist: {
        src: ["dist"]
      },
      raw: {
        src: ["dist/css/*.css", "! dist/css/*.min.css",
          "dist/js/*.js", "! dist/js/*.min.js"]
      }
    },
    coffee: {
      all: {
        expand: true,
        cwd: "src/coffee",
        src: ["*.coffee"],
        dest: "dist/js",
        ext: ".js",
        extDot: "first"
      }
    },
    copy: {
      all: {
        files: [
          {
            expand: true,
            cwd: "src/html",
            src: ["*"],
            dest: "dist/",
            filter: "isFile"
          },
          {
            expand: true,
            cwd: "src/css",
            src: ["*"],
            dest: "dist/css",
            filter: "isFile"
          },
          {
            expand: true,
            cwd: "src/js",
            src: ["*"],
            dest: "dist/js",
            filter: "isFile"
          },
          {
            expand: true,
            cwd: "src/assets",
            src: ["**"],
            dest: "dist/assets"
          }
        ]
      }
    },
    csslint: {
      all: {
        options: {
          csslintrc: ".csslintrc"
        },
        src: ["dist/css/*"]
      }
    },
    cssmin: {
      all: {
        options: {
          banner: "/* <%= pkg.author.name %> " +
            "<<%= pkg.author.email %>> (<%= pkg.author.url %>) */"
        },
        expand: true,
        cwd: "dist/css",
        src: ["*.css"],
        dest: "dist/css",
        ext: ".min.css",
        extDot: "first"
      }
    },
    imagemin: {
      dist: {
        expand: true,
        cwd: "dist/assets/images",
        src: ["*.{png, jpg, gif}"],
        dest: "dist/assets/images"
      }
    },
    jade: {
      all: {
        options: {
          data: function() {
            var optionsFile = (process.env.PROD) ?
              "prod.options.json" : "dev.options.json";
            return require("./" + optionsFile);
          }
        },
        expand: true,
        cwd: "src/jade",
        src: ["*.jade"],
        dest: "dist/",
        ext: ".html",
        extDot: "first"
      }
    },
    jshint: {
      all: {
        options: {
          jshintrc: true
        },
        src: ["Gruntfile.js", "dist/js/*"]
      }
    },
    nodemon: {
      server: {
        script: "server.js",
        options: {
          env: {
            NODE_JS_PORT: "9999"
          },
          watch: ["server.js"]
        }
      }
    },
    sass: {
      all: {
        expand: true,
        cwd: "src/sass",
        src: ["*.sass", "*.scss"],
        dest: "dist/css",
        ext: ".css",
        extDot: "first",
        options: {sourcemap: "none"}
      }
    },
    stylus: {
      all: {
        expand: true,
        cwd: "src/stylus",
        src: ["*.styl"],
        dest: "dist/css",
        ext: ".css",
        extDot: "first"
      }
    },
    uglify: {
      all: {
        options: {
          compress: true,
          mangle: true,
          banner: "/* <%= pkg.author.name %> " +
            "<<%= pkg.author.email %>> (<%= pkg.author.url %>) */"
        },
        expand: true,
        cwd: "dist/js",
        src: ["*.js"],
        dest: "dist/js",
        ext: ".min.js",
        extDot: "first"
      }
    },
    watch: {
      jade: {
        files: ["src/jade/**/*"],
        tasks: ["jade"],
        options: {spawn: false}
      },
      sass: {
        files: ["src/sass/**/*"],
        tasks: ["sass", "csslint"],
        options: {spawn: false}
      },
      stylus: {
        files: ["src/stylus/*.styl"],
        tasks: ["stylus", "csslint"],
        options: {spawn: false}
      },
      css: {
        files: ["src/css/*.css"],
        tasks: ["copy", "csslint"],
        options: {spawn: false}
      },
      js: {
        files: ["src/js/*.js"],
        tasks: ["copy", "jshint"],
        options: {spawn: false}
      },
      coffee: {
        files: ["src/coffee/*.coffee"],
        tasks: ["coffee", "jshint"],
        options: {spawn: false}
      },
      html: {
        files: ["src/html/*.html"],
        tasks: ["copy"],
        options: {spawn: false}
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-csslint");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-jade");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-stylus");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("test", ["csslint", "jshint"]);
  grunt.registerTask("default", ["copy", "jade", "sass", "stylus",
    "coffee", "test"]);
  grunt.registerTask("dist", ["default", "cssmin", "uglify",
    "imagemin", "clean:raw"]);
};
