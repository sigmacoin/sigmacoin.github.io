// Load Sigma balance from local storage
let sigmaEarned = parseFloat(localStorage.getItem("sigmaEarned")) || 0;

// Display the initial balance
document.getElementById("sigmaBalance").textContent = sigmaEarned.toFixed(2);

// Watch Ads button functionality
document.getElementById("watchAdsButton").addEventListener("click", function () {
    // Show the ad
    showAd();

    // Add 0.25 Sigma after the ad is displayed
    setTimeout(() => {
        sigmaEarned += 0.25; // Add 0.25 Sigma
        document.getElementById("sigmaBalance").textContent = sigmaEarned.toFixed(2); // Update balance display
        localStorage.setItem("sigmaEarned", sigmaEarned); // Save to local storage
        alert("You earned 0.25 Sigma by watching an ad!");
    }, 1000); // Simulate ad display delay
});

function showAd() {
    // Inject the ad code into the ad container
    const adContainer = document.getElementById("adContainer");
    adContainer.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1879329283352330"
             data-ad-slot="6128464077"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    `;
    adContainer.style.display = "block"; // Show the ad container
}
