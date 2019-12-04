var width = document.getElementById("network").clientWidth,
    height = width*7/11,
    radius=22;

var margin = {top: 0, right: 0, bottom: 0, left: 0};


var svg_network = d3.select("#network").append("svg")
    // .attr("id","networksvg")
    // .attr("width", width)
    // .attr("height", height)
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMidYMid meet");






// Load data
d3.json("data/connections.json", function(data) {


    // console.log(data);


    // 1) INITIALIZE FORCE-LAYOUT
    var force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-10))
        .force("link", d3.forceLink(data.links).distance(50))
        .force("center", d3.forceCenter().x(width/2).y(height/3))
        .force("collision",d3.forceCollide().radius(function(d) {
            return radius+8
        }))
        .alphaDecay(0.01);


    // 2a) DEFINE 'NODES' AND 'EDGES'


    var edges = svg_network.selectAll(".edge")
        .data(data.links)
        .enter().append("line")
        .style("stroke","#ccc")
        .style("stroke-width",4)
        .style("opacity",0.8);

    var node = svg_network.selectAll(".node")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", radius)
        .attr("fill",function(d){
            if(d.y2020 ){
                return "#FF0080"
            }else{
                return "#343a40"
            }
        })
        // .attr("fill", function(d){
        //     if(d.city == "New York, NY"){
        //         return "#FF0080"
        //     }else if( d.city == "Boston, MA"){
        //         return "#d9df00"
        //     }else if( d.city == "Washington DC"){
        //         return "#7a41ff"
        //     }else if( d.city == "Austin, TX"){
        //         return "#fe6b00"
        //     }else if( d.city == "San Fransisco, CA"){
        //         return "#009fdf"
        //     }else if( d.city =="Philadelphia, PA"){
        //         return "#84e12b"
        //     }else{
        //         return "#343a40"
        //     }
        // });


    var label = svg_network.selectAll(".nodelabel")
        .data(data.nodes)
        .enter().append("text")
        .attr("class", "nodelabel")
        .text(function(d) { return d.name; })
        .attr("fill","#ffffff");
        // .attr("fill", function(d) {
        //     if (d.city == "Boston, MA") {
        //         return "#343a40"
        //     } else if (d.city == "Philadelphia, PA"){
        //         return "#343a40"
        //     }else{
        //         return "#ffffff"
        //     }
        // });

    // 2b) START RUNNING THE SIMULATION
    force.on("tick", function() {

        // Update labels
        label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
        // Update node coordinates
        // node
        //     .attr("cx", function(d) { return d.x; })
        //     .attr("cy", function(d) { return d.y; });
        node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

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