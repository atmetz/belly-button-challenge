// Get samples.json from URL
const samplesUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(samplesUrl).then(function(data) {
    
    // call populateDropdown function
    populateDropdown(data);

    d3.selectAll("#selDataset").on("change", optionChanged(data.samples));
});


function populateDropdown(data){
    // Set names to names from data file
    let names = data.names

    let dropdowntest = d3.select("#selDataset");

    // Add names to drop down menu
    for (i=0; i<names.length; i++) {

        dropdowntest.append("option").attr("value",names[i]).text(names[i]);
    }
}


// Function optionChanged
function optionChanged(data) {
    
    let dropdownMenu = d3.select("#selDataset");
    
    // Assign the value of the dropdown menu option to a letiable
    let dataset = dropdownMenu.property("value");
    
    // Initialize an empty array for the subject's data
    let subjectData = [];

    subjectData = data[0];

    let topOTUs = subjectData.otu_ids.slice(0,10);
    let topOTUValues = subjectData.sample_values.slice(0,10);
    let topOTULabels = subjectData.otu_labels.slice(0,10);

    // Call updatePlotly to graph selected subject.
    updatePlotly(topOTUs, topOTUValues);

}

function updatePlotly(topOTUs, topOTUValues) {

    // Set OTU Labels for graphing
    let yLabels = [];

    for (i=0; i<topOTUs.length; i++) {
        yLabels.push("OTU " + topOTUs[i]);
    }

    // Reverse yLabels and topOTUValues for graphing
    topOTUValues.reverse();
    yLabels.reverse();

    // set trace1
    let trace1 = {
        x: topOTUValues,
        y: yLabels,
        type: "bar",
        orientation: 'h'
    }

    dataTrace = [trace1];

    // set layout
    let layout = {
        title: 'Belly Button Biodiversity'
    }

    // Create graph
    Plotly.newPlot("plot", dataTrace, layout);

}