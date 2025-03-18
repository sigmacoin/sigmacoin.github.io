let miningInterval;
let startTime;
let sigmaEarned = 0;
const sigmaPrice = 2.24; // Price of 1 Sigma in USD
const miningDuration = 6 * 3600 * 1000; // 6 hours in milliseconds

// Load saved mining data from local storage
const savedMiningData = JSON.parse(localStorage.getItem("miningData"));

if (savedMiningData) {
    startTime = savedMiningData.startTime;
    sigmaEarned = savedMiningData.sigmaEarned;

    // Check if mining is still in progress
    const currentTime = Date.now();
    const timeElapsed = currentTime - startTime;

    if (timeElapsed < miningDuration) {
        // Mining is still in progress
        startMining();
    } else {
        // Mining is finished
        sigmaEarned = (miningDuration / 3600000).toFixed(6); // Total Sigma earned
        alert("Mining completed! You earned " + sigmaEarned + " Sigma.");
        localStorage.removeItem("miningData"); // Clear saved data
    }
}

document.getElementById("mineImage").addEventListener("click", function () {
    if (miningInterval) {
        alert("Mining is already in progress!");
        return;
    }

    if (savedMiningData) {
        alert("Mining resumed!");
    } else {
        alert("Mining started! You will earn Sigma every 6 hours.");
        startTime = Date.now(); // Record the start time
        sigmaEarned = 0; // Reset Sigma earned
    }

    startMining();
});

function startMining() {
    // Save mining data to local storage
    localStorage.setItem("miningData", JSON.stringify({ startTime, sigmaEarned }));

    // Update the mining details every second
    miningInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;

        if (timeElapsed >= miningDuration) {
            // Mining is finished
            clearInterval(miningInterval);
            sigmaEarned = (miningDuration / 3600000).toFixed(6); // Total Sigma earned
            alert("Mining completed! You earned " + sigmaEarned + " Sigma.");
            localStorage.removeItem("miningData"); // Clear saved data
        } else {
            // Calculate Sigma earned (1 Sigma = 1 hour of mining)
            sigmaEarned = (timeElapsed / 3600000).toFixed(6); // Convert milliseconds to hours
        }

        // Update the UI
        document.getElementById("timeElapsed").textContent = `${Math.floor(timeElapsed / 1000)}s`;
        document.getElementById("sigmaEarned").textContent = sigmaEarned;
        document.getElementById("sigmaPrice").textContent = sigmaPrice.toFixed(2);
    }, 1000); // Update every second
}
