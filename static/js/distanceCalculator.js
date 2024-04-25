// Function to calculate the distance between two airports
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

// Update the HTML element with the calculated distance
function updateDistance(distance) {
    const distanceElement = document.getElementById('distance');
    distanceElement.textContent = distance.toFixed(2) + ' km';
}
