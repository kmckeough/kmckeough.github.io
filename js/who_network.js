// Will be used to the save the loaded csv data
var networkData = [];
var timeData = [];

d3.json("data/connections.json", function (error, importData) {



    networkData = importData;


    // timeData = importData.filter(d => d.years !="All");


    create_network();


});

function create_network() {
    //  Create event handler
    var MyEventHandler = {};

    var network = new Network("network", networkData);

    // var years = new yearSelect("dateselect1", timeData, MyEventHandler);


    // Bind event handler for dropdwon menu
    // $(MyEventHandler).bind("dateChange",function(event, selection){
    //     network.onDateChange(selection);
    //     years.updateColor(selection);
    // });

}
