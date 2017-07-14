/**
 * Created by ayakut on 7/14/17.
 */
(function(scope){
    var ITEM_COUNT = 1000;
    var items = ListSetup.createItems(ITEM_COUNT);


    scope.Items = {
        list: items,
    };
})(window)