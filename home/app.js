// AQI ranges and their corresponding status
const aqiRanges = [
    { min: 0, max: 50, status: 'Good', color: '#00e400' },
    { min: 51, max: 100, status: 'Moderate', color: '#ffff00' },
    { min: 101, max: 150, status: 'Unhealthy for Sensitive Groups', color: '#ff7e00' },
    { min: 151, max: 200, status: 'Unhealthy', color: '#ff0000' },
    { min: 201, max: 300, status: 'Very Unhealthy', color: '#8f3f97' },
    { min: 301, max: 500, status: 'Hazardous', color: '#7e0023' }
];

// Function to calculate the position percentage based on AQI value
function calculatePositionPercentage(value) {
    // Ensure value is within valid range (0-500)
    const clampedValue = Math.min(Math.max(value, 0), 500);
    
    // Calculate percentage based on scale segments
    if (clampedValue <= 50) {
        return (clampedValue / 50) * 16.67; // First segment (0-50)
    } else if (clampedValue <= 100) {
        return 16.67 + ((clampedValue - 50) / 50) * 16.67; // Second segment (51-100)
    } else if (clampedValue <= 150) {
        return 33.34 + ((clampedValue - 100) / 50) * 16.67; // Third segment (101-150)
    } else if (clampedValue <= 200) {
        return 50.01 + ((clampedValue - 150) / 50) * 16.67; // Fourth segment (151-200)
    } else if (clampedValue <= 300) {
        return 66.68 + ((clampedValue - 200) / 100) * 16.67; // Fifth segment (201-300)
    } else {
        return 83.35 + ((clampedValue - 300) / 200) * 16.65; // Last segment (301-500)
    }
}

// Function to update AQI marker position and status
function updateAQI(value) {
    const aqiValue = parseInt(value);
    const aqiMarker = document.getElementById('aqiMarker');
    const aqiStatus = document.getElementById('aqiStatus');
    const aqiDisplay = document.getElementById('aqiValue');
    
    // Update the displayed AQI value
    aqiDisplay.textContent = aqiValue;
    
    // Calculate the marker position
    const percentage = calculatePositionPercentage(aqiValue);
    aqiMarker.style.left = `${percentage}%`;
    
    // Find the current range and update status
    const currentRange = aqiRanges.find(range => aqiValue <= range.max);
    if (currentRange) {
        aqiStatus.textContent = currentRange.status;
        aqiStatus.style.backgroundColor = `${currentRange.color}20`;
        aqiStatus.style.color = currentRange.color;
        aqiDisplay.style.color = currentRange.color;
    }
}

// Initialize with current AQI value
document.addEventListener('DOMContentLoaded', () => {
    const initialAQI = document.getElementById('aqiValue').textContent;
    updateAQI(initialAQI);
    
    // Optional: Add click event for the locate button
    document.getElementById('locateBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    });
});

// Function to test different AQI values
function testAQI(value) {
    updateAQI(value);
}

// Uncomment to test different values
// Examples of testing different ranges:
// setTimeout(() => testAQI(25), 1000);   // Good
// setTimeout(() => testAQI(75), 2000);   // Moderate
// setTimeout(() => testAQI(125), 3000);  // Unhealthy for Sensitive Groups
// setTimeout(() => testAQI(175), 4000);  // Unhealthy
// setTimeout(() => testAQI(250), 5000);  // Very Unhealthy
// setTimeout(() => testAQI(350), 6000);  // Hazardous