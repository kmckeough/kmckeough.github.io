// Will be used to the save the loaded csv data
var stateData = [];
var timelineData=[];
var tooltipData=[];

// Date parser to convert strings to date objects
var dateFormatter = d3.timeFormat("%Y-%m");
var dateParser = d3.timeParse("%Y-%m-%d");

// Variables for the visualization instances
var map, timeline;

d3.csv("data/cart_table", function (error, importData) {



    importData.forEach(function(d) {
        for (var column in d) {
            d[column] = Number(d[column]) ;
        }
    });

    stateData = importData;


    createVis();


});

function createVis() {
    //  Create event handler
    var MyEventHandler = {};

    var map = new Cartogram("map-container", stateData);

    // var dropMenu = new DropDown("dropdown-menu2", allData,MyEventHandler);
    //
    // // Bind event handler for timeline selection
    // $(MyEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
    //     map.onSelectionChange(rangeStart, rangeEnd);
    // });
    //
    // // Bind event handler for dropdwon menu
    // $(MyEventHandler).bind("dropdownChange",function(event, selection){
    //     map.onDropDownChange(selection);
    //     timeline.onDropDownChange();
    // });
    //
    // //  Create visualization instances
    // var timeline = new Timeline("timeline", timelineData,MyEventHandler,tooltipData);
}