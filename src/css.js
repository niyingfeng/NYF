// 对于样式进行处理'
// hide show
// addCss removeCss
// addClass removeClass
// toggle

N.define( "css", ["arrayUtil"], function( arrayUtil ){
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
        if( !isArray(classes) ){
            classes = [classes];
        }

        map( doms, function( dom ){
            var classStr = dom.className,
                oldclasses = dealClass( classStr ),
                newclasses;

                newclasses = arrayUtil.mergeRepeatArray( classes, oldclasses );

                dom.className = newclasses.join(" ");
        } );

    }

    function deleteClass( doms, classes ){
        if( !isArray(doms) ){
            doms = [doms];
        }
        if( !isArray(classes) ){
            classes = [classes];
        }

        map( doms, function( dom ){
            var classStr = dom.className,
                oldclasses = dealClass( classStr ),
                newclasses;

                newclasses = arrayUtil.deleteRepeat( oldclasses, classes );

                dom.className = newclasses.join(" ");
        } );
    }
});