// Will be used to the save the loaded csv data
var areaData = [];

// Set ordinal color scale
roo_scheme=["#fe6b00",
    "#d9df00",
    "#FF0080",
    "#84e12b",
    "#009fdf",
    "#7a41ff",
    "#343a40"]
var colorScale = d3.scaleOrdinal(roo_scheme);


// Variables for the visualization instances
var map, timeline;


// Start application by loading the data

 d3.csv("data/area_table.csv", function (error, peopleData) {



        peopleData.forEach(function(d) {
            for (var column in d) {
                d[column] = Number(d[column]) ;
            }
            d.years = new  Date(d.years, 01, 01)
        });

        areaData = peopleData;

        colorScale.domain(d3.keys(areaData[0]).filter(function(d){ return d != "years"; }));

        createVis();


 });

function createVis() {
    //  Create event handler
    var MyEventHandler = {};
    // console.log(areaData);

    var area = new StackedAreaChart("timeline", areaData);

   /* var dropMenu = new DropDown("dropdown-menu2", allData,MyEventHandler);

    // Bind event handler for timeline selection
    $(MyEventHandler).bind("selectionChanged", function(event, rangeStart, rangeEnd){
        map.onSelectionChange(rangeStart, rangeEnd);
    });

    // Bind event handler for dropdwon menu
    $(MyEventHandler).bind("dropdownChange",function(event, selection){
        map.onDropDownChange(selection);
        timeline.onDropDownChange();
    });

    //  Create visualization instances
    var timeline = new Timeline("timeline", timelineData,MyEventHandler,tooltipData);*/
}