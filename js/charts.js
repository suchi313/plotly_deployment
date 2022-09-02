function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var filteredSample = filteredSamples[0];
    console.log(filteredSample)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var values = filteredSample.sample_values;
    var ids = filteredSample.otu_ids;
    var labels = filteredSample.otu_labels;

    // console.log(values)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(ids)
    var yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`);

    // 8. Create the trace for the bar chart. 
    var trace = [{
      type: 'bar',
      x: values.slice(0,10).reverse(),
      y: yticks.reverse(),
      text: labels.slice(0,10).reverse(),
      orientation: 'h'
    }];

    var barData = trace

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found in Belly Buttons'
     };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        size: values,
        color: ids,
        colorscale: "Earth"
      },
      type: "scatter"
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: 'OTU IDs'},
      margin: {t: 30, l: 30},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 


    // Deliverable 3 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata
    var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataSample = filteredMetadata[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
   var wfreq = metadataSample.wfreq
   
   var parsedWfreq = parseFloat(wfreq)
  console.log(wfreq);
   
    // Create the yticks for the bar chart.

    // // Use Plotly to plot the bar data and layout.
    // Plotly.newPlot();
    
    // // // Use Plotly to plot the bubble data and layout.
    // Plotly.newPlot();
   
    
    // // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: parsedWfreq,
      mode: "gauge+number",
      title: {text:"Belly Button Washing Frequency <br> The # of Scrubs per Week"},
      type: "indicator",
      gauge: {
        axis: {range: [null, 10], tickwidth: 1},
        bar: {color: "black"},
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"}
        ]}
    }];
    
    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      margin: { t: 25, r: 25, l: 25, b: 25 }
    };

    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}