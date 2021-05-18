const second_width = 1000;
const second_height = 850;

const projection = d3.geoMercator().center([132, -28]) // approximate geographical center of Australia
                   .translate([second_width/2, second_height/2])
                   .scale(1000);


const second_color = d3.scaleQuantize().range(['#edf8fb','#ccece6','#99d8c9','#66c2a4','#2ca25f','#006d2c']);
    
const path = d3.geoPath().projection(projection);


const second_svg = d3.select("#chart2")
			.append("svg")
			.attr("width", second_width)
			.attr("height", second_height);


d3.csv("data/Waste_Per_State_Per_Capita(1).csv").then(function(data) {

	//Set input domain for color scale
	second_color.domain([
		d3.min(data, function(d) { return d.Total; }), 
		d3.max(data, function(d) { return d.Total; })
	]);

    d3.json("data/aust.json").then(function(json) {

        for (var i = 0; i < data.length; i++) {
    
            var data_state = data[i].States;
            
            //Grab data value, and convert from string to float
            var dataValue = parseFloat(data[i].Total);
    
       
            for (var j = 0; j < json.features.length; j++) {
            
                var json_state = json.features[j].properties.STATE_NAME;
                console.log(json_state);
    
                if (data_state == json_state) {
            
                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;
                    
                    //Stop looking through the JSON
                    break;
                    
                }
            }		
        }

        second_svg.selectAll("path")
			.data(json.features)
		    .enter()
			.append("path")
			.attr("d", path)
			.style("fill", function(d) {
			//Get data value
				var value = d.properties.value;
					   		
				if (value) {
					//If value exists…
					return second_color(value);
				} else {
					//If value is undefined…
					return "#ccc";
				}
			});

            

			// Write down state names...
            second_svg.selectAll("text")
				.data(json.features)
				.enter()
				.append("text")
				.attr("fill", "black")
				.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
				.attr("text-anchor", "middle")
    			.attr("dy", ".35em")
				.text(function(d) {
					return d.properties.STATE_NAME;
				});

			
			
   });
})

            
// Create "Overall Food Waste Per Capita"
second_svg.append('text')
          .attr('x', second_width / 2)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', '20px')
          .text('Amount of food waste per capita in Australian states, 2019 (kg/year)');