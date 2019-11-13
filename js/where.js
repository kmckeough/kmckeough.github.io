// Will be used to the save the loaded csv data
var stateData = [];

d3.csv("data/cart_table", function (error, importData) {



    importData.forEach(function(d) {
        for (var column in d) {
            d[column] = Number(d[column]) ;
        }
    });

    stateData = importData;


    create_cart();


});

function create_cart() {
    //  Create event handler
    var MyEventHandler = {};

    // var map = new Cartogram("map-container", stateData);

    var years = new yearSelect("dateselect2", stateData, MyEventHandler);


    // Bind event handler for dropdwon menu
    $(MyEventHandler).bind("dateChange",function(event, selection){
        // map.onDropDownChange(selection);
    });

}