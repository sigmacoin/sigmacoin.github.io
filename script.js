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
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
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

// Sign Up with Email/Password
signupButton.addEventListener('click', () => {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log("Sign Up Button Clicked"); // Debugging
    console.log("First Name:", firstName); // Debugging
    console.log("Last Name:", lastName); // Debugging
    console.log("Email:", email); // Debugging
    console.log("Password:", password); // Debugging

    if (!firstName || !lastName || !email || !password) {
        authMessage.textContent = 'Please fill in all fields.';
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User Created:", user); // Debugging

            // Send email verification
            user.sendEmailVerification()
                .then(() => {
                    authMessage.textContent = 'Confirmation email sent. Please check your inbox.';
                    console.log("Verification Email Sent"); // Debugging
                })
                .catch((error) => {
                    authMessage.textContent = error.message;
                    console.error("Error Sending Verification Email:", error); // Debugging
                });

            // Save user details to Firestore
            db.collection('users').doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                balance: 0,
                miningProgress: 0,
                emailVerified: false
            })
            .then(() => {
                console.log("User Data Saved to Firestore"); // Debugging
            })
            .catch((error) => {
                console.error("Error Saving User Data:", error); // Debugging
            });
        })
        .catch((error) => {
            authMessage.textContent = error.message;
            console.error("Error Creating User:", error); // Debugging
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
            // Check if the user is new
            if (result.additionalUserInfo.isNewUser) {
                // Send email verification
                user.sendEmailVerification()
                    .then(() => {
                        authMessage.textContent = 'Confirmation email sent. Please check your inbox.';
                    })
                    .catch((error) => {
                        authMessage.textContent = error.message;
                    });
            }

            // Save user details to Firestore
            db.collection('users').doc(user.uid).set({
                firstName: user.displayName.split(' ')[0],
                lastName: user.displayName.split(' ')[1] || '',
                email: user.email,
                balance: 0,
                miningProgress: 0,
                emailVerified: user.emailVerified
            }, { merge: true }); // Use merge to avoid overwriting existing data
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
        });
});

// Show App After Authentication
function showApp() {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
        document.querySelector('.auth-container').style.display = 'none';
        container.style.display = 'block';
        loadUserData();
    } else if (user) {
        authMessage.textContent = 'Please verify your email to access the app.';
    }
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
