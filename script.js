let miningInterval;
let startTime;
let sigmaEarned = 0;
const sigmaPrice = 2.24; // Price of 1 Sigma in USD

document.getElementById("mineImage").addEventListener("click", function () {
    if (miningInterval) {
        alert("Mining is already in progress!");
        return;
    }

    alert("Mining started! You will earn Sigma every 6 hours.");
    startTime = Date.now(); // Record the start time

    // Update the mining details every second
    miningInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000); // Time in seconds

        // Calculate Sigma earned (1 Sigma = 1 hour of mining)
        sigmaEarned = (timeElapsed / 3600).toFixed(6); // Convert seconds to hours

        // Update the UI
        document.getElementById("timeElapsed").textContent = `${timeElapsed}s`;
        document.getElementById("sigmaEarned").textContent = sigmaEarned;
        document.getElementById("sigmaPrice").textContent = sigmaPrice.toFixed(2);
    }, 1000); // Update every second
});
