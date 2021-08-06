d3.json('samples.json').then(({names})=>{
    names.forEach(name => {
        d3.select('select').append('option').text(name)
    });
    renderData();
});

function optionChanged() {
    renderData();
};

function renderData() {
    let sel = d3.select('select').property('value');

    d3.json('samples.json').then(({metadata,samples})=>{

        var meta = metadata.filter(obj=>obj.id==sel)[0]
        var sample = samples.filter(obj=>obj.id==sel)[0]

        console.log(metadata);

        d3.select('.panel-body').html('');
        Object.entries(meta).forEach(([key,val])=>{
            d3.select('.panel-body').append('h5').text(key.toUpperCase()+': '+val)
        });

        var barData = [
            {
              x: sample.sample_values.slice(0,10).reverse(),
              y: sample.otu_ids.slice(0,10).reverse().map(x=>'OTU '+ x),
              type: 'bar',
              orientation:'h'
            }
          ];
          
          Plotly.newPlot('bar', barData);


          var trace1 = {
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: 'markers',
            text: sample.otu_labels,
            marker: {
              size: sample.sample_values,
              color: sample.otu_ids,
              colorscale: 'Earth'
            },
        };
        
        var bubbleData = [trace1];
        
        var layout = {
            title: 'Bacteria Culture per Sample',
            showlegend: false,
          };
          
          Plotly.newPlot('bubble', bubbleData, layout);

          var gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: meta.wfreq,
              title: { text: "<b>Belly Button Wash frequency</b><br>Scrub per week" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [0, 10] } }
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', gaugeData, layout);

    });
};
