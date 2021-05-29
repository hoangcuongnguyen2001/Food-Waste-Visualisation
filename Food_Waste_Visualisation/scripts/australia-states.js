//Created with help from Michael Rovinsky:
//https://stackoverflow.com/questions/67649076/how-to-create-tooltips-for-multiple-values-in-a-choropleth-in-d3-v5/67718199#67718199

const second_width = 1000;
const second_height = 850;

//Define map projection // geoEqualEarth

// approximate geographical center of Australia, marked 
// 2.5 degrees lower on latitude from Lambert gravitation centre
// Source: https://www.ga.gov.au/scientific-topics/national-location-information/dimensions/centre-of-australia-states-territories#:~:text=000%20scale%20maps.-,Lambert%20gravitational%20centre,named%20in%20honour%20of%20Dr.
const projection = d3.geoMercator()
                     .center([ 132, -28 ])
                     .translate([ second_width/2, second_height/2 ])
                     .scale(1000);


//Define path generator
const path = d3.geoPath().projection(projection);

const second_color =  d3.scaleQuantize()
                        .range(['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']);

//Create SVG
const second_svg = d3.select("#chart2")
    .append("svg")
    .attr("width", second_width)
    .attr("height", second_height);

//Load in GeoJSON data
d3.json('https://gist.githubusercontent.com/GerardoFurtado/02aa65e5522104cb692e/raw/8108fbd4103a827e67444381ff594f7df8450411/aust.json')
    .then(json => onGeoJsonLoaded(json))
    .catch(err => console.log('ERROR: ', err));
  
const onGeoJsonLoaded = json => {
//Bind data and create one path per GeoJSON feature
const states = second_svg.selectAll('g.state')
                         .data(json.features)
                         .enter()
                         .append('g')
                         .classed('state', true);


d3.csv('data/Waste_Per_State_Per_Capita(1).csv').then(function(data) {

  second_color.domain([
		d3.min(data, function(d) { return d.Total; }), 
		d3.max(data, function(d) { return d.Total; })
	]);

        for (var i = 0; i < data.length; i++) {
    
            
            var data_States = data[i].States;
           
            
            var dataValue = parseFloat(data[i].Total);

            for (var j = 0; j < json.features.length; j++) {
            
                var json_States = json.features[j].properties.STATE_NAME;
    
                if (data_States == json_States) {
            
                    json.features[j].properties.value = dataValue;
                    
                    //Stop looking through the JSON
                    break;
                    
                }
            }		
        }
      })

      


    states.append('path')
        .attr("d", path)
        .attr("stroke", 'white')
        .attr("fill", function(d) {

            const value = d.properties.value;
            
            console.log(d.properties);
                     
            if (value) {

              return second_color(value);
            } else {

              return "#ccc";
            }
          });

    
                  
    states.append("text")
            .attr("fill", "darkslategray")
            .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .attr("dy", 15)
            .text(function(d) {
                 return d.properties.STATE_NAME;
            });


d3.json('data/Waste_Per_State_Per_Capita.json')
    .then(dataJson => onDataJsonLoaded(dataJson))
    .catch(err => console.log('ERR: ', err));
  
 
}

const tooltipPath = (width, height, offset, radius) => {
    const left = -width / 2;
    const right = width / 2;
    const top = -offset - height;
    const bottom = -offset;

    // Creating a polygon for containing data.
    return `M 0,0 
      L ${-offset},${bottom} 
      H ${left + radius}
      Q ${left},${bottom} ${left},${bottom - radius}  
      V ${top + radius}   
      Q ${left},${top} ${left + radius},${top}
      H ${right - radius}
      Q ${right},${top} ${right},${top + radius}
      V ${bottom - radius}
      Q ${right},${bottom} ${right - radius},${bottom}
      H ${offset} 
      L 0,0 z`;
}

const onDataJsonLoaded = json => {
  
  const rows = Object.keys(json[0]).filter(n => n !== 'States');
  
  const second_tooltip = second_svg.append('g')
                                   .classed('tooltip', true)
                                   .style('visibility', 'hidden');

  second_tooltip.append('path')
                .attr('d', tooltipPath(200, 80, 5, 5))
  rows.forEach((row, index) => {

    second_tooltip.append('text')
                  .text(`${row} :`)
                  .attr('x', -70)
                  .attr('y', -68 + index * 18);
    second_tooltip.append('text')
                  .classed(row.replace(' ', '_'), true)
                  .attr('x', 30)
                  .attr('y', -68 + index * 18);
     second_tooltip.append('text')
                  .text(`(kg/year)`)
                  .attr('x', 50)
                  .attr('y', -68 + index * 18);
    });

    
  second_svg.selectAll('g.state')
    .on('mouseenter', d => {
      const stateData = json.find(s => s.States == d.properties.STATE_NAME);
      rows.forEach(row => second_tooltip.select(`.${row.replace(' ', '_')}`).text(stateData[row]));
      second_tooltip.attr('transform', `translate(${path.centroid(d)})`);
      second_tooltip.style('visibility', 'visible');
    })
    .on('mouseleave', () => tooltip.style('visibility', 'hidden'));
};




// Create name for the map.
second_svg.append('text')
          .attr('x', second_width / 2)
          .attr('y', 40)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', '20px')
          .text('Amount of food waste per capita in Australian states, 2019 (kg/year)');