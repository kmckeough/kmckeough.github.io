// http://bl.ocks.org/herrstucki/6199768


var margin = {top: 0, right: 60, bottom: 0, left: 60};

var width = document.getElementById("flower-chart").clientWidth-margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    petals = 12,
    halfRadius = 15,
    cols=6;

var svg_flower = d3.select("#flower-chart").append("svg")
    .attr("id","flowersvg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//https://bl.ocks.org/ezzaouia/6ce9cd4c940525600500b6742fbc4b13


// Load data
d3.csv("data/people_info.csv", function(data) {

//    Sort Data by number of years

    data.sort(function(a,b){
        return b.num - a.num;
    });

    var rows =  Math.ceil(data.length/cols+1);
    var petal_height = Math.min(height/rows/2,width/rows/2);


    var location_data = data.map(function(d,i){
        return {
            name: d.name,
            petals : [d.y2015, d.y2016, d.y2017,d.y2018,d.y2019,d.y2020],
            num: d.num,
            x : (width/cols + width/cols*(i-1))%(width-1) + width/cols/2,
            y :  height/rows * Math.floor(i/cols+1)
        };
    });

    var petal_max = Math.max.apply(Math, location_data.map(function(d) {
        return d.num;
    }));

    // var petals = d3.range(petal_max);
    // var petals = location_data.map(function(d){
    //     return [d.y2015,d.y2016,d.y2017,d.y2018,d.y2019,d.y2020]
    // });
    // console.log(petals);

    // the below  area
    var petal_area = d3.area()
        .x((d) => { return d.x; })
        .y1((d) => { return d.y; })
        .y0((d) => { return 0; })
        .curve(d3.curveBasis);

    var draw_petal =[{x:0, y:0}, {x:petal_height/3, y:petal_height/3}, {x:petal_height, y:0},
                    {x:petal_height/3, y:-petal_height/3}, {x:0, y:0}  ]

    let g = svg_flower.selectAll('g')
        .data(location_data)
        .enter()
        .append('g')
        .attr('transform', function(d){
            return 'translate(' + d.x+ ',' + d.y + ')'
        });

    g.selectAll('leaf')
        .data(function(d){return d.petals;})
        .enter()
        .append('g')
        .classed('leaf', true)
        .attr('transform', function (d, i) {
            return 'rotate(' + (360 * i / location_data[0].petals.length) + ') translate(10,0) ';
        });

    d3.selectAll('.leaf')
        .append('path')
        .attr('d', petal_area(draw_petal))
        .attr('fill', function(d,i){
            if(d==1){
                if(i%petal_max==(petal_max-1)){
                    return "#009fdf"
                }else{
                    return "#FF0080"
                }

            }
        });

    g.selectAll('stem')
        .data(function(d){
            return [d.name] ;
        })
        .enter()
        .append('circle')
        .classed('stem',true)
        .attr('r',petal_height/4)
        .attr('fill',"#d9df00")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });;



    //
    //
    // var size = d3.scaleLinear()
    //     .domain([0,1])
    //     .range{[0,halfRadius]}
    //
    // //
    // var flowerbox = svg_flower
    //     .selectAll('.flowerbox')
    //     .data(location_data)
    //     .enter().append('g')
    //     .attr('class','flowerbox')
    //     .attr("transform", function(d, i) {
    //         return "translate(" + d.x + "," + d.y + ")";
    //     });
    //
    // var pie = d3.layout.pie()
    //     .sort(null)
    //     .value(function(d) { return d.size; });

    // var petal = svg_flower.selectAll(".petal")
        // .data(location_data)
        // .enter().append('circle')
        // .attr("class", "petal")
        // .attr("cx",function(d){
        //     return d.x;
        // })
        // .attr("cy",function(d){
        //     return d.y;
        // })
        // .attr("r",5)
        // .attr("fill","white")
        // .attr("title",function(d){
        //     return d.name;
        // });
        // .data(function(d) { return pie(d.num); })
        // .enter().append("path")
        // .attr("class", "petal")
        // .attr("transform", function(d) { return r((d.startAngle + d.endAngle) / 2); })
        // .attr("d", petalPath)
        // .style("stroke", petalStroke)
        // .style("fill", petalFill);

});