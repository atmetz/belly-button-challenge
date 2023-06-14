// Get samples.json from URL
const samplesUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(samplesUrl).then(function(data) {
    // console.log(data);
    
    // call populateDropdown function
    populateDropdown(data);
    let subjectData = data.samples;
    let metaData = data.metadata;
    
    });

function populateDropdown(data){
    // Set names to names from data file
    let names = data.names;

    let dropDownSel = d3.select("#selDataset");

    // Add names to drop down menu
    for (i=0; i<names.length; i++) {

        dropDownSel.append("option").attr("value",names[i]).text(names[i]);
    }

    optionChanged(data.value);
}


// Function optionChanged
function optionChanged(value) {
    
    let dropdownMenu = d3.select("#selDataset");
    
    // Assign the value of the dropdown menu option to a letiable
    let dataset = dropdownMenu.property("selectedIndex");

    d3.json(samplesUrl).then(function(data) {
    // Initialize an empty array for the subject's data
    let subjectData = [];
    let subjectMetaData = [];

    subjectData = data.samples[dataset];
    subjectMetaData = data.metadata[dataset];

    console.log(subjectData);

    // Update Sample MetaData
    let metaDataTag = d3.select("#sample-metadata");
    d3.selectAll("li").remove();
    metaDataTag.append("li").text("id: " + subjectMetaData.id);    
    metaDataTag.append("li").text("ethnicity: " + subjectMetaData.ethnicity);    
    metaDataTag.append("li").text("gender: " + subjectMetaData.gender);    
    metaDataTag.append("li").text("age: " + subjectMetaData.age);    
    metaDataTag.append("li").text("location: " + subjectMetaData.location);    
    metaDataTag.append("li").text("bbtype: " + subjectMetaData.bbtype);    
    metaDataTag.append("li").text("wfreq: " + subjectMetaData.wfreq);

    let topOTUs = subjectData.otu_ids.slice(0,10);
    let topOTUValues = subjectData.sample_values.slice(0,10);
    let topOTULabels = subjectData.otu_labels.slice(0,10);

    // Call updatePlotly to graph selected subject.
    updatePlotly(topOTUs, topOTUValues, topOTULabels);

    updateBubble(subjectData.otu_ids, subjectData.sample_values, subjectData.otu_labels);

    updateGauge(subjectMetaData.wfreq);

})}

function updatePlotly(topOTUs, topOTUValues, topOTULabels) {

    //Create Bar Graph

    // Set OTU Labels for graphing
    let yLabels = [];

    for (i=0; i<topOTUs.length; i++) {
        yLabels.push("OTU " + topOTUs[i]);
    }

    // Reverse yLabels, topOTUValues, and topOTULabels for graphing
    topOTUValues.reverse();
    yLabels.reverse();
    topOTULabels.reverse();

    // set trace1
    let trace1 = {
        x: topOTUValues,
        y: yLabels,
        type: "bar",
        orientation: 'h',
        text: topOTULabels
    };

    dataTrace = [trace1];

    // set layout
    let layout = {
        autosize: false,
        width: 400,
        height: 500
    };

    // Create graph
    Plotly.newPlot("bar", dataTrace, layout);
    
}

function updateBubble(otu_ids, sample_values, otu_labels){

    // Set trace2 for Bubble Graph
    let trace2 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values,
            text: otu_labels
        },
        type: 'scatter'
    };

    dataTrace2 = [trace2];

    // Set layout 2 for Bubble Graph
    let layout2 = {
        title: "OTU ID",
        autosize: true,
        showlegend: false
    };

    // Create Bubble Graph
    Plotly.newPlot("bubble", dataTrace2, layout2);

}

function updateGauge (washCount) {

    // set trace3 for Gauge graph
    let trace3 = {
        value: washCount,
        type: "indicator",
        mode: "gauge",
        gauge: {
            axis: {range: [null, 9]},
            steps: [
                {range: [0,1]},
                {range: [1,2]},
                {range: [2,3]},
                {range: [3,4]},
                {range: [4,5]},
                {range: [5,6]},
                {range: [6,7]},
                {range: [7,8]},
                {range: [8,9]}
            ]
        }
    };

    let data3 = [trace3];

    let layout3 = {
        title: "Belly Button Wash Frequency",
        width: 500,
        height: 500
    }

    Plotly.newPlot('gauge', data3, layout3);
}