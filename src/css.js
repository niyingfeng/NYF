// 对于样式进行处理'
// hide show
// addCss removeCss
// addClass removeClass
// toggle

// N.define( "css", ["arrayUtil"], function( arrayUtil ){
//     var trim = N.trim,
//         filter = N.filter,
//         each = N.each,
//         isArray = N.isArray;

//     function dealClass( classStr ){
//         var classesName = [],
//             classStr = trim( classStr );

//         return classStr.split(/\s+/g);
//     }

//     function addClass( doms, classes ){
//         if( !isArray(doms) ){
//             doms = [doms];
//         }
//         if( !isArray(classes) ){
//             classes = [classes];
//         }

//         each( doms, function( dom ){
//             var classStr = dom.className,
//                 oldclasses = dealClass( classStr ),
//                 newclasses;

//                 newclasses = arrayUtil.mergeRepeatArray( classes, oldclasses );

//                 dom.className = newclasses.join(" ");
//         } );

//     }

//     function deleteClass( doms, classes ){
//         if( !isArray(doms) ){
//             doms = [doms];
//         }
//         if( !isArray(classes) ){
//             classes = [classes];
//         }

//         each( doms, function( dom ){
//             var classStr = dom.className,
//                 oldclasses = dealClass( classStr ),
//                 newclasses;

//                 newclasses = arrayUtil.deleteRepeat( oldclasses, classes );

//                 dom.className = newclasses.join(" ");
//         } );
//     }

//     function hide( doms ){
//         if( !isArray(doms) ){
//             doms = [doms];
//         }

//         each( doms, function( dom ){
//             dom.style.display = "none";
//         } );
//     } 

//     function show( doms ){
//         if( !isArray(doms) ){
//             doms = [doms];
//         }

//         each( doms, function( dom ){
//             dom.style.display = "block";
//         } );
//     }

//     return {
//         addClass : addClass,
//         deleteClass : deleteClass,

//         show : show,
//         hide : hide
//     }
// });