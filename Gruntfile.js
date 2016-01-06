/*eslint-env node*/
/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({

        dir: { //lego
            webapp: "src",
            tests: "test",
            dist: "dist",
            bower_components: "bower_components",
            localServerTestUrl: "http://localhost:8080/test-resources"
        },

        tests: {
            opaTimeout: 900000
        },

        connect: {
            options: {
                port: 8080,
                hostname: "*"
            },
            src: {
                options: {
                    open: {
                        target: "http://localhost:8080/index.html"
                    }
                }
            },
            dist: {
                options: {
                    open: {
                        target: "http://localhost:8080/build.html"
                    }
                }
            }
        },

        openui5_connect: {
            options: {
                resources: [
                    "<%= dir.bower_components %>/openui5-sap.ui.core/resources",
                    "<%= dir.bower_components %>/openui5-sap.m/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.layout/resources",
                    "<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources"
                ]
            },
            src: {
                options: {
                    appresources: ["."],
                    testresources: ["<%= dir.tests %>"]
                }
            },
            dist: {
                options: {
                    appresources: ".",
                    testresources: ["<%= dir.tests %>"]
                }
            }
        },

        clean: {
            dist: "<%= dir.dist %>/"
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= dir.webapp %>",
                    src: [
                        "**",
                        "!test/**"
                    ],
                    dest: "<%= dir.dist %>"
                }]
            }
        },

        eslint: {
            options: {
                quiet: true
            },

            all: ["<%= dir.tests %>", "<%= dir.webapp %>"],
            webapp: ["<%= dir.webapp %>"]
        },

        qunit: {
            options: {
                /* for debugging*/
                timeout: 10000,
                "--remote-debugger-autorun": "yes",
                "--remote-debugger-port": 8000
            },

            unit: {
                options: {
                    urls: [
                        "<%= localServerTestUrl %>/StripToastr.qunit.html"
                    ]
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-contrib-qunit");

    // Server task
    grunt.registerTask("serve", function(target) {
        grunt.task.run("openui5_connect:" + (target || "src") + ":keepalive");
    });

    // Linting task
    grunt.registerTask("lint", ["eslint:all"]);

    // Build task
    grunt.registerTask("build", ["clean", "openui5_preload", "copy"]);
    grunt.registerTask("buildRun", ["build", "serve:dist"]);

    // Test task
    grunt.registerTask("test", ["qunit:unit"]);
    grunt.registerTask("unitTest", ["openui5_connect:src", "qunit:unit"]);
    

    // Default task
    grunt.registerTask("default", [
        "lint:all",
        "test"
    ]);
};
