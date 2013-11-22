// 对于样式进行处理'
// hide show
// addCss removeCss
// addClass removeClass
// toggle

N.define( "css", function(){
    var trim = N.trim,
        filter = N.filter,
        isArray = N.isArray;

    function dealClass( classStr ){
        var classesName = [],
            classStr = trim( classStr );

        return classStr.split(/\s+/g);
    }

    function addClass( doms, classes ){
        if( !isArray(doms) )
    }
});