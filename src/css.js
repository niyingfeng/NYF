// 对于样式进行处理'
// hide show
// addCss removeCss
// addClass removeClass

N.define( "css", function(){
    var trim = N.trim,
    ;

    function dealClass( classStr ){
        var classesName = [],
            classStr = trim( classStr );

        return classStr.split(/\s+/g);
    }
});