//https://www.sitepoint.com/ajaxjquery-getjson-simple-example/

/*
    To-do:
        - Work on calculating totals for each ifa
*/

var data = [];

$(document).ready(function(){
    $.getJSON("Resources/dev_test.dat", data, function(data){
        var dataStore = [];

        var uniqueIFA = findIFAS(data);

        console.log(uniqueIFA);

        //Now need to run through each IFA, totalling up the sales for each

        for(var i = 0; i < uniqueIFA.length; i++) {
            var total = 0;

            var currentIFAData = data.filter(function(obj) {
                return obj.ifa === uniqueIFA[i][0];
            });

            //For each row for this IFA add to IFA's total
            for(var j = 0; j < currentIFAData.length; j++) {
                total += parseInt(currentIFAData[j].sales);
            }

            console.log("IFA TOTAL FOR " + uniqueIFA[i][0] + ": " + total);
        }

        /*
        $.each(data, function() {
            var total = 0;

            var currentIFAData = data.filter(function(obj) {
                return obj.ifa = uniqueIFA[2][2];
            });

            console.log(uniqueIFA[2][0]);
            console.log("IFA Data:" + currentIFAData);

            for(var i = 0; i < currentIFAData.length; i++) {
                total += parseInt(currentIFAData[i].sales);
            }
            console.log("total:" + total);
        })*/

    })
    $.getJSON("Resources/dev_test.dat", function(data){
        console.log(data);
    }).fail(function() {
        console.log("error in JSON file parsing");
    });
});

//Function to return an array of unique IFAs mentioned in the data
//Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function findIFAS(data) {
    var uniqueIFA = [];
    var duplicateIFA = {};

    $.each(data, function(i, el) {
        if(!duplicateIFA[el.ifa]) {
            duplicateIFA[el.ifa] = true;
            uniqueIFA.push([el.ifa, 0]);
        }
    });

    return uniqueIFA;
}