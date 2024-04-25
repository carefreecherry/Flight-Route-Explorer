let airportLocationsDisplayed = false;
let airportEntities = []; // Array to store airport entities

document.getElementById('loadAirportsButton').addEventListener('click', function() {
    if (airportLocationsDisplayed) {
        // Remove airport locations if they are currently displayed
        removeAirportLocations();
        airportLocationsDisplayed = false;
    } else {
        // Load airport data from CSV file
        fetch('/static/airports.csv') // Change 'airports.csv' to the path of your CSV file
            .then(response => response.text())
            .then(csvData => {
                // Parse CSV data
                const airportData = parseCsv(csvData);

                // Display airport locations on Cesium globe
                airportEntities = displayAirportLocations(airportData);
                airportLocationsDisplayed = true;
            })
            .catch(error => {
                console.error('Error loading CSV data:', error);
            });
    }
});

function removeAirportLocations() {
    // Remove airport entities from the Cesium viewer
    airportEntities.forEach(entity => {
        viewer.entities.remove(entity);
    });
    airportEntities = []; // Clear the array
}

// Function to parse CSV data
function parseCsv(csvData) {
    // Split CSV data into lines
    const lines = csvData.split('\n');

    // Extract header and data
    const headers = lines[0].split(',');
    const airportData = [];

    // Parse each line into an object
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const airport = {};
        for (let j = 0; j < headers.length; j++) {
            airport[headers[j]] = values[j];
        }
        airportData.push(airport);
    }

    return airportData;
}

// Function to display airport locations
function displayAirportLocations(airportData) {
    const airportEntities = [];

    // Iterate through airport data and add markers to the Cesium viewer
    airportData.forEach(airport => {
        const { name, lat, lng } = airport;
        const position = Cesium.Cartesian3.fromDegrees(parseFloat(lng), parseFloat(lat));
        const airportEntity = viewer.entities.add({
            name: name,
            position: position,
            point: {
                pixelSize: 2,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: .5
            }
        });
        airportEntities.push(airportEntity);
    });

    return airportEntities;
}
