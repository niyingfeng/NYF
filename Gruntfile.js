module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> by yingfeng */\n'
            },
            dist: {
                src: ['src/<%=pkg.name %>.js', 'src/*.js'],
                dest: 'build/<%= pkg.name %>.dev.js'
            }            
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> by yingfeng */\n'
            },
            build: {
                src: ['src/<%=pkg.name %>.js', 'src/*.js'],
                dest: 'build/<%= pkg.name %>.min.js'
            }               
        }
    });

    // 加载提供"concat"任务的插件
    grunt.loadNpmTasks('grunt-contrib-concat');
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 默认任务
    grunt.registerTask('default', ['concat','uglify']);
}