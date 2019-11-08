var width = document.getElementById("who").clientWidth,
    height = 800;

var svg = d3.select("#network").append("svg")
    .attr("id","networksvg")
    .attr("width", width)
    .attr("height", height);






// Load data
d3.json("data/connections.json", function(data) {


    // console.log(data);


    // 1) INITIALIZE FORCE-LAYOUT
    var force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(data.links).distance(100))
        .force("center", d3.forceCenter().x(width/2).y(height/2))
        .alphaDecay(0.01);


    // 2a) DEFINE 'NODES' AND 'EDGES'


    var edges = svg.selectAll(".edge")
        .data(data.links)
        .enter().append("line")
        .style("stroke","#ccc")
        .style("stroke-width",4);

    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 25)
        .attr("fill", function(d){
            if(d.city == "New York, NY"){
                return "#FF0080"
            }else if( d.city == "Boston, MA"){
                return "#d9df00"
            }else if( d.city == "Washington DC"){
                return "#7a41ff"
            }else if( d.city == "Austin, TX"){
                return "#fe6b00"
            }else if( d.city == "San Fransisco, CA"){
                return "#009fdf"
            }else if( d.city =="Philadelphia, PA"){
                return "#84e12b"
            }else{
                return "#343a40"
            }
        });


    var label = svg.selectAll(".nodelabel")
        .data(data.nodes)
        .enter().append("text")
        .attr("class", "nodelabel")
        .text(function(d) { return d.name; })
        .attr("fill", function(d) {
            if (d.city == "Boston, MA") {
                return "#343a40"
            } else if (d.city == "Philadelphia, PA"){
                return "#343a40"
            }else{
                return "#ffffff"
            }
        });

    // 2b) START RUNNING THE SIMULATION
    force.on("tick", function() {

        // Update labels
        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        // Update node coordinates
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        // Update edge coordinates
        edges
            .attr("x1",function(d){return d.source.x;})
            .attr("y1",function(d){ return d.source.y;})
            .attr("x2",function(d){return d.target.x;})
            .attr("y2", function(d){ return d.target.y;})
    });


    // Dragging

    function dragStarted(d){
        if(!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx=d.x;
        d.fy=d.y;
    };

    function dragging(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    function dragEnded(d){
        if(!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    node.call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

    label.call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));






});