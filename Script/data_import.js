var data = [];

$(document).ready(function(){
    $.getJSON("Resources/dev_test.dat", data, function(data){
        var dataStore = [];

        $.each(data, function(key, val) {
            var total = 0;

            data.forEach(element => total += parseInt(element.sales));
            console.log("total:" + total);
        })

    })
    $.getJSON("Resources/dev_test.dat", function(data){
        console.log(data);
    }).fail(function() {
        console.log("error in JSON file parsing");
    });
});