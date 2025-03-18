let sigmaEarned = 0;

document.getElementById("watchAdsButton").addEventListener("click", function () {
    sigmaEarned = (parseFloat(sigmaEarned) + 0.25).toFixed(6); // Add 0.25 Sigma
    alert("You earned 0.25 Sigma by watching an ad!");
});
