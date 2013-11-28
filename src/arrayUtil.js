// 集中一些对于数组的处理方法 参考一下 underscore
// dealRepeat 合并多个数组去除重复元素
// shuffle 将数组元素随机打乱

N.define("arrayUtil", function(){
    var each = N.each,
        isArray = N.isArray,
        slice = Array.prototype.slice;

    /** 合并多个数组去除重复元素 mergeRepeatArray
    *  
    *   @method mergeRepeatArray
    *   @param {array} arrays 需要去重合并的 数组 组
    *   @return {Object} 返回合并去重的数组
    *   
    *   dealRepeat([1,2,3],[2,5,6]); return [1,2,3,5,6]
    */
    function mergeRepeatArray(){
        var keyObj = {},
            finalArr = [],
            arrays = slice.call( arguments );

        each( arrays, function( array ){
            each(array, function( item ){
                if( keyObj[item] === undefined ){
                    keyObj[item] = true;
                    finalArr.push( item );
                }
            });
        });

        return finalArr;

    }

    /** 对原数组去除重复元素 deleteRepeat
    *  
    *   @method deleteRepeat
    *   @param {array} originArr 需要去重的原数组
    *   @param {array} deleteArr 需要去除的元素数组
    *   @return {Object} 返回合并去重的数组
    *   
    *   dealRepeat([1,2,3],[2,4]); return [1,3]
    */
    function deleteRepeat( originArr, deleteArr ){
        var targetArr=[],delObj = {}, i , len;
        for(i=0,len=deleteArr.length; i<len; i++){
            delObj[ deleteArr[i] ] = true;
        }

        for(i=0,len=originArr.length; i<len; i++ ){
            if( delObj[ originArr[i] ] !== true){
                targetArr.push(originArr[i]);
            }
        }

        return targetArr;

    }

    /** 随机重排序数组元素 shuffle
    *  
    *   @method shuffle
    *   @param {array} array 需要随机重排序的数组
    *   @return {Object} 返回合并去重的数组
    *   
    *   shuffle([1,2,3,5,6]); return [3,2,6,5,1]
    */
    function shuffle( array ){
        var len = array.length,
            shuffled = array.slice(),
            random;

        each( array, function( item, i ){
            var random = Math.randon() * len >>> 0;
            shuffled[i] = shuffled[random];
            shuffled[random] = item;
        } );

        return shuffled;
    }

    return {
        mergeRepeatArray : mergeRepeatArray,
        deleteRepeat : deleteRepeat,
        shuffle : shuffle
    }
});