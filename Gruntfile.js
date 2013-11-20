module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            concat: {
                src: ['src/<%=pkg.name %>.js', 'src/*.js'],
                dest: 'build/<%= pkg.name %>.dev.js'
                
            },
            build: {
                src: ['src/<%=pkg.name %>.js', 'src/*.js'],
                dest: 'build/<%= pkg.name %>.min.js'
            }               
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 默认任务
    grunt.registerTask('default', ['uglify']);
}