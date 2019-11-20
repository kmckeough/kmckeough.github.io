// Will be used to the save the loaded csv data
var stateData = [];
var timeData = [];
var colorMax = 0;

d3.csv("data/cart_table", function (error, importData) {



    importData.forEach(function(d) {
        for (var column in d ) {
            if( column != 'years'){
                d[column] = Number(d[column]) ;
            }
        }
    });

    importData.forEach(function(d) {
        for (var column in d) {
            if(d[column]>colorMax & column != 'years'){
                colorMax=d[column];
            } ;
        }
    });

    stateData = importData;
    timeData = importData.filter(d => d.years !="All");
    console.log(timeData);


    create_cart();


});

function create_cart() {
    //  Create event handler
    var MyEventHandler = {};

    var map = new Cartogram("map-container", stateData, colorMax);

    var years = new yearSelect("dateselect2", timeData, MyEventHandler);


    // Bind event handler for dropdwon menu
    $(MyEventHandler).bind("dateChange",function(event, selection){
        map.onDateChange(selection);
        years.updateColor(selection);
    });

}
