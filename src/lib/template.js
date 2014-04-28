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
            escape : /<%=([\s\S]+?)%>/,
            unescape : /<%-([\s\S]+?)%>/,
            normal : /<%([\s\S]+?)%>/,
            noMatch : /(.)^/
        },
        transformReg = new Regexp();
} );