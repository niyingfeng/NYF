N.define( 'template', function(){
    var escapeMap = {
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&quot;',
            "'" : '&#x27;'
        },

        escapeReg = /[&<>"\']/g,

        transformMethod = {
            escape : '<%=([\s\S]+?)%>',
            unescape : '<%-([\s\S]+?)%>',
            normal : '<%([\s\S]+?)%>'
        },
        transformReg = new RegExp([
            transformMethod.escape,
            transformMethod.unescape,
            transformMethod.normal].join('|'), 'g');

    var esacpeFunc = function( str ){
        return str.replace( escapeReg, function( match ){
            return escapeMap[ match ];
        } );
    };


    return function( tmpl, data ){
        var tmplStr = "_s+='",
            index = 0;

        tmpl.replace( transformReg, function( match, escape, unescape, normal, offset){
            tmplStr += tmpl.slice(index, offset);

            if( escape ){
                tmplStr += "';+\n((" + escape + ")==null?'':esacpeFunc(escape))+\n'"
            }else if( unescape ){
                tmplStr += "';+\n((" + unescape + ")==null?'':unescape)+\n'"
            }else if( normal ){
                tmplStr += "';+\n" + normal + "\n'"
            }

            index = offset + match.length;
        } );
    }

    // <%=name%>aaa<%if(c){%>bbb<%}%>ccc
    function (data){
        var _s = '';

        with(data){
            _s += name;
            _s += 'aaa';
            if(c){
            _s += 'bbb'
            }
            _s += 'ccc'
        }

        return _s;

    }

} );