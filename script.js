let balance = 0;
let mining = false;
let timer = 86400; // 24 hours in seconds

document.querySelectorAll('.ad-button').forEach(button => {
    button.addEventListener('click', () => {
        balance += 0.5;
        updateBalance();
    });
});

document.querySelector('.mine-button').addEventListener('click', () => {
    if (!mining) {
        mining = true;
        startMining();
    }
});

function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(1);
}

function startMining() {
    const timerElement = document.getElementById('timer');
    const interval = setInterval(() => {
        timer--;
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timer <= 0) {
            clearInterval(interval);
            mining = false;
            balance += 30;
            updateBalance();
            timer = 86400; // Reset timer
        }
    }, 1000);
}
