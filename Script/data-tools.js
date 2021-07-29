//Function to return an array of unique IFAs mentioned in the data
//Source used: https://stackoverflow.com/questions/7431618/jquery-finding-distinct-values-in-object-array
function findIFAS(data) {
    var duplicateIFA = {};
    var uniqueIFA = [];

    $.each(data, function (i, el) {
        if (!duplicateIFA[el.ifa]) {
            duplicateIFA[el.ifa] = true;
            uniqueIFA.push(el.ifa);
        }
    });

    return uniqueIFA;
}

//Function to return an array of unique years in the data
function findYears(data) {
    var duplicateYears = {};
    var uniqueYears = [['Year', 'Sales']];

    $.each(data, function(i, el) {
        if(!duplicateYears[el.year]) {
            duplicateYears[el.year] = true;
            uniqueYears.push([el.year, 0]);
        }
    });

    return uniqueYears;
}

function findFunds(data) {
    var duplicateFunds = {};
    var uniqueFunds = [];

    $.each(data, function(i, el) {
        if(!duplicateFunds[el.fund]) {
            duplicateFunds[el.fund] = true;
            uniqueFunds.push(el.fund);
        }
    });

    return uniqueFunds;
}