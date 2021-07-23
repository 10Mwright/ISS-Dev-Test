//https://www.sitepoint.com/ajaxjquery-getjson-simple-example/

/*
    To-do:
        - Work on calculating totals for each ifa
*/

var data = [];

$(document).ready(function(){
    $.getJSON("Resources/dev_test.dat", data, function(data){
        var dataStore = [];

        $.each(data, function() {
            var total = 0;

            for(var i = 0; i < data.length; i++) {
                if(data[i].ifa === "Orange Investments") {
                    total += parseInt(data[i].sales);
                }
            }
            console.log("total:" + total);
        })

    })
    $.getJSON("Resources/dev_test.dat", function(data){
        console.log(data);
    }).fail(function() {
        console.log("error in JSON file parsing");
    });
});