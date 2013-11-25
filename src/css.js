// 对于样式进行处理'
// hide show
// addCss removeCss
// addClass removeClass
// toggle

N.define( "css", ["arrayUtil.js"] function( arrayUtil ){
    var trim = N.trim,
        filter = N.filter,
        map = N.map,
        isArray = N.isArray;

    function dealClass( classStr ){
        var classesName = [],
            classStr = trim( classStr );

        return classStr.split(/\s+/g);
    }

    function addClass( doms, classes ){
        if( !isArray(doms) ){
            doms = [doms];
        }

        map( doms, function( dom ){
            var classStr = dom.className,
                classes = dealClass( classStr );

            var hasClassed = some(classes, function(class){

                                });
        } );

    }
});