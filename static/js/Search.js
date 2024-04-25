// Parse CSV data and store airport information
let airportData = [];

// Load CSV data
fetch('/static/airports.csv')
    .then(response => response.text())
    .then(csvData => {
        airportData = parseCsv(csvData);
    })
    .catch(error => {
        console.error('Error loading CSV data:', error);
    });

// Function to parse CSV data
function parseCsv(csvData) {
    const lines = csvData.trim().split('\n');
    const airports = [];
    for (let i = 1; i < lines.length; i++) {
        const [id, name, city, iata, icao, lat, lng] = lines[i].split(',');
        airports.push({ id, name, city, iata, icao, lat: parseFloat(lat), lng: parseFloat(lng) });
    }
    return airports;
}

let searchedAirports = [];

// Function to search for an airport by name
function searchAirport() {
    const searchInput = document.getElementById('airportSearch').value.trim().toLowerCase();
    const airport = airportData.find(airport => airport.name.toLowerCase() === searchInput);
    if (airport) {
        displayAirportLocation(airport);
        searchedAirports.push(airport);
    } else {
        console.error('Airport not found');
    }
}

// Function to display airport location on the globe
function displayAirportLocation(airport) {
    viewer.entities.add({
        name: airport.name,
        position: Cesium.Cartesian3.fromDegrees(airport.lng, airport.lat),
        point: {
            pixelSize: 5,
            color: Cesium.Color.RED
        }
    });
}

// Function to display the shortest path between airports in searchedAirports array
function displayShortestPath() {
    // Check if there are at least two airports in the array
    if (searchedAirports.length < 2) {
        console.error('At least two airports are required to calculate the shortest path');
        return;
    }

    // Calculate the shortest path between airports
    const shortestPath = calculateShortestPath(searchedAirports);

    // Display the shortest path on the globe
    displayPathOnGlobe(shortestPath);

    // Display the distance between the airports
    displayDistanceBetweenAirports(searchedAirports[0], searchedAirports[1]);
    console.log('Distance between airports displayed');
}

// Function to calculate the distance between two airports in kilometers
function calculateDistanceBetweenAirports(airport1, airport2) {
    const lat1 = airport1.lat;
    const lon1 = airport1.lng;
    const lat2 = airport2.lat;
    const lon2 = airport2.lng;

    // Calculate distance using haversine formula
    const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
    return distance;
}
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    // Radius of the Earth in kilometers
    const R = 6371; 
    
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Function to display the distance between two airports on the webpage
function displayDistanceBetweenAirports(airport1, airport2) {
    console.log('Calculating distance between airports...');
    const distance = calculateDistanceBetweenAirports(airport1, airport2);
    const distanceElement = document.getElementById('distance');
    distanceElement.textContent = `Distance between ${airport1.name} and ${airport2.name}: ${distance.toFixed(2)} km`;
}


// Function to calculate the shortest path between airports using Dijkstra's algorithm
function calculateShortestPath(airports) {
    const graph = {}; // Graph representation
    const distances = {}; // Shortest distances from source airport
    const visited = {}; // Visited airports
    const previous = {}; // Previous airport in the shortest path
    const unvisitedAirports = new Set(); // Unvisited airports

    // Initialize graph and distances
    for (const airport of airports) {
        graph[airport.id] = {};
        distances[airport.id] = Infinity;
        previous[airport.id] = null;
        unvisitedAirports.add(airport.id);
        for (const destinationAirport of airports) {
            if (airport.id !== destinationAirport.id) {
                graph[airport.id][destinationAirport.id] = calculateDistance(airport, destinationAirport);
            }
        }
    }

    // Helper function to calculate distance between two airports
    function calculateDistance(airport1, airport2) {
        const lat1 = airport1.lat;
        const lon1 = airport1.lng;
        const lat2 = airport2.lat;
        const lon2 = airport2.lng;
        // Calculate distance using haversine formula
        // Implementation of haversine formula is skipped here
        return calculateHaversineDistance(lat1, lon1, lat2, lon2);
    }

    // Set distance of source airport to 0
    distances[airports[0].id] = 0;

    // Dijkstra's algorithm
    while (unvisitedAirports.size > 0) {
        let minAirportId = null;
        for (const airportId of unvisitedAirports) {
            if (!minAirportId || distances[airportId] < distances[minAirportId]) {
                minAirportId = airportId;
            }
        }
        const currentAirport = minAirportId;
        visited[currentAirport] = true;
        unvisitedAirports.delete(currentAirport);
        for (const neighborAirport in graph[currentAirport]) {
            const distance = distances[currentAirport] + graph[currentAirport][neighborAirport];
            if (distance < distances[neighborAirport]) {
                distances[neighborAirport] = distance;
                previous[neighborAirport] = currentAirport;
            }
        }
    }

    // Build the shortest path
    const shortestPath = [];
    let currentAirport = airports[1].id; // Destination airport
    while (currentAirport) {
        shortestPath.unshift(currentAirport);
        currentAirport = previous[currentAirport];
    }

    return shortestPath;
}
function displayPathOnGlobe(shortestPath) {
    // Define line positions for the path
    const positions = shortestPath.map(airportId => {
        const airport = airportData.find(a => a.id === airportId);
        return Cesium.Cartesian3.fromDegrees(airport.lng, airport.lat);
    });

    // Add polyline entity to represent the path
    viewer.entities.add({
        name: "Shortest Path",
        polyline: {
            positions: positions,
            width: 3,
            material: Cesium.Color.YELLOW
        }
    });

    // Zoom to the path
    viewer.zoomTo(viewer.entities);
}
