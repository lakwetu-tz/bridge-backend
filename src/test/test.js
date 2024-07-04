const axios = require('axios');

const endpoint = 'http://127.0.0.1:5050/api/v1/entries';

function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function sendPostRequest() {
    const data = {
        deviceId: '129302',
        vib: getRandomFloat(20, 55), // Random float between 200 and 300
        temp: getRandomFloat(20, 35), // Random float between 800 and 900
        wgt: getRandomFloat(600, 7000) // Random float between 60000 and 70000
    };

    axios.post(endpoint, data)
        .then(response => {
            console.log('Data sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending data:', error.message);
        });
}

// Send data every 10 seconds
setInterval(sendPostRequest, 10000);

// Immediately send data on start
sendPostRequest();
