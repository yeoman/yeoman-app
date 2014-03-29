module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodewebkit: {
            dev: {
                options: {
                    app_name: 'Yeoman',
                    app_version: '<%= pkg["version"] %>',
                    build_dir: './',
                    mac_icns: 'img/yeoman.icns',
                    mac: true,
                    zip: true,
                    win: false,
                    linux32: false,
                    linux64: false,
                    version: '0.9.2'
                },
                src: ['index.html', 'package.json', './css/*', './img/*']
            },
            dist: {
                options: {
                    app_name: 'Yeoman',
                    app_version: '<%= pkg["version"] %>',
                    build_dir: './',
                    mac_icns: 'img/yeoman.icns',
                    mac: true,
                    win: true,
                    linux32: true,
                    linux64: true,
                    version: '0.9.2'
                },
                src: ['index.html', 'package.json', './css/*', './img/*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.registerTask('build', ['nodewebkit:dev'])
    grunt.registerTask('release', ['nodewebkit:dist'])
};
