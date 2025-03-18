// Load Sigma balance from local storage
let sigmaEarned = parseFloat(localStorage.getItem("sigmaEarned")) || 0;

// Display the initial balance
document.getElementById("sigmaBalance").textContent = sigmaEarned.toFixed(2);

// Watch Ads button functionality
document.getElementById("watchAdsButton").addEventListener("click", function () {
    sigmaEarned += 0.25; // Add 0.25 Sigma
    document.getElementById("sigmaBalance").textContent = sigmaEarned.toFixed(2); // Update balance display
    localStorage.setItem("sigmaEarned", sigmaEarned); // Save to local storage
    alert("You earned 0.25 Sigma by watching an ad!");
});
