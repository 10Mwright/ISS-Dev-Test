//https://www.sitepoint.com/ajaxjquery-getjson-simple-example/

/*
    To-do:
        - Work on calculating totals for each ifa
*/

window.chartData = [];

$.getJSON("Resources/dev_test.dat", data, function (data) {
    var uniqueIFA = findIFAS(data);

    console.log("Array of unique IFAs: " + uniqueIFA);

    //Now need to run through each IFA, totalling up the sales for each

    //For each unique IFA, go through the data and total up its sales
    for (var i = 1; i < uniqueIFA.length; i++) {
        var total = 0;

        var currentIFAData = data.filter(function (obj) {
            return obj.ifa === uniqueIFA[i][0];
        });

        //For each row of data for this IFA add to IFA's total sales
        for (var j = 0; j < currentIFAData.length; j++) {
            total += parseInt(currentIFAData[j].sales);
        }

        console.log("IFA TOTAL FOR " + uniqueIFA[i][0] + ": " + total);
        uniqueIFA[i][1] = total; //Commit sales total to 2d IFA array
    }

    console.log("Array of unique IFAs: " + uniqueIFA);
    document.getElementById('output').innerHTML = uniqueIFA;
    chartData = uniqueIFA.slice();

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

}).fail(function () {
    console.log("error in retrieving data from JSON file!");
});

//Function to return an array of unique IFAs mentioned in the data
//Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function findIFAS(data) {
    var duplicateIFA = {};
    var uniqueIFA = [['IFA', 'Sales']];

    console.log("RAN!");

    $.each(data, function (i, el) {
        if (!duplicateIFA[el.ifa]) {
            duplicateIFA[el.ifa] = true;
            uniqueIFA.push([el.ifa, 0]);
        }
    });

    return uniqueIFA;
}