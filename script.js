// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUDujXOp2kn-rq_khlPSTdyDoQ0XcGSdQ",
    authDomain: "sigma-coin-57cb2.firebaseapp.com",
    projectId: "sigma-coin-57cb2",
    storageBucket: "sigma-coin-57cb2.firebasestorage.app",
    messagingSenderId: "569246251329",
    appId: "1:569246251329:web:4bb58bfe198110600d89c0",
    measurementId: "G-B5EGF7X6NT"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');
const authMessage = document.getElementById('auth-message');
const googleSignInButton = document.getElementById('google-signin-button');
const container = document.querySelector('.container');
const adButtons = document.querySelectorAll('.ad-button');
const mineButton = document.querySelector('.mine-button');
const balanceDisplay = document.getElementById('balance');
const timerDisplay = document.getElementById('timer');

let balance = 0;
let mining = false;
let timer = 86400; // 24 hours in seconds

// Sign Up
signupButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            db.collection('users').doc(user.uid).set({
                balance: 0,
                miningProgress: 0
            });
            authMessage.textContent = 'Sign up successful!';
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
        });
});

// Log In
loginButton.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            authMessage.textContent = 'Login successful!';
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
        });
});

// Google Sign-In
googleSignInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            db.collection('users').doc(user.uid).set({
                balance: 0,
                miningProgress: 0
            }, { merge: true }); // Use merge to avoid overwriting existing data
            authMessage.textContent = 'Google Sign-In successful!';
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
        });
});

// Show App After Authentication
function showApp() {
    document.querySelector('.auth-container').style.display = 'none';
    container.style.display = 'block';
    loadUserData();
}

// Load User Data from Firestore
function loadUserData() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    balance = doc.data().balance;
                    updateBalance();
                }
            });
    }
}

// Update Balance in Firestore
function updateBalance() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({
            balance: balance
        });
        balanceDisplay.textContent = balance.toFixed(1);
    }
}

// Watch Ads
adButtons.forEach(button => {
    button.addEventListener('click', () => {
        balance += 0.5;
        updateBalance();
    });
});

// Mine Sigma Coin
mineButton.addEventListener('click', () => {
    if (!mining) {
        mining = true;
        startMining();
    }
});

// Start Mining
function startMining() {
    const interval = setInterval(() => {
        timer--;
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timer <= 0) {
            clearInterval(interval);
            mining = false;
            balance += 30;
            updateBalance();
            timer = 86400; // Reset timer
        }
    }, 1000);
}

// Check Auth State
auth.onAuthStateChanged((user) => {
    if (user) {
        showApp();
    } else {
        document.querySelector('.auth-container').style.display = 'block';
        container.style.display = 'none';
    }
});
