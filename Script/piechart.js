var data = [];

getData();

//Gather relevant data
function getData() {
    $.getJSON("Resources/dev_test.dat", data, function(data) {
        //First get unique ifas, and get data on a per ifa basis
        //Must calculate market share by dividing ifa's total sales by overall total
        //Then work on filtering out years and funds
        var uniqueIFA = findIFAS(data);

        for(var i = 0; i < uniqueIFA; i++) { //For each unique IFA
            var total = 0;

            var currentIFAData = data.filter(function(obj) { //Get IFAs data
                return obj.ifa === uniqueIFA[i];
            });

            for(var j = 0; j < currentIFAData.length; j++) {
                total += parseInt(currentIFAData[j].sales);
            }

            console.log("Sales total for: " + uniqueIFA[j] + " is " + total);

            //Must convert original 1D array into 2D array to store this value.
        }
    }).fail(function() {
        console.log("error in retrieving data from JSON file!");
    });
}