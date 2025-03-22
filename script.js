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
const googleSignInButton = document.getElementById('google-signin-button');
const facebookSignInButton = document.getElementById('facebook-signin-button');
const phoneNumberInput = document.getElementById('phone-number');
const sendOtpButton = document.getElementById('send-otp-button');
const otpInput = document.getElementById('otp');
const verifyOtpButton = document.getElementById('verify-otp-button');
const authMessage = document.getElementById('auth-message');
const container = document.querySelector('.container');
const adButtons = document.querySelectorAll('.ad-button');
const mineButton = document.querySelector('.mine-button');
const balanceDisplay = document.getElementById('balance');
const timerDisplay = document.getElementById('timer');

let balance = 0;
let mining = false;
let timer = 86400; // 24 hours in seconds
let confirmationResult; // For phone authentication

// Continue with Google
googleSignInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Google Sign-In Successful:", user); // Debugging
            saveUserData(user);
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
            console.error("Google Sign-In Error:", error); // Debugging
        });
});

// Continue with Facebook
facebookSignInButton.addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Facebook Sign-In Successful:", user); // Debugging
            saveUserData(user);
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
            console.error("Facebook Sign-In Error:", error); // Debugging
        });
});

// Send OTP for Phone Number
sendOtpButton.addEventListener('click', () => {
    const phoneNumber = phoneNumberInput.value;

    if (!phoneNumber) {
        authMessage.textContent = 'Please enter a valid phone number.';
        return;
    }

    const appVerifier = new firebase.auth.RecaptchaVerifier('send-otp-button', {
        size: 'invisible',
    });

    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmation) => {
            confirmationResult = confirmation;
            authMessage.textContent = 'OTP sent to your phone number.';
            otpInput.style.display = 'block';
            verifyOtpButton.style.display = 'block';
        })
        .catch((error) => {
            authMessage.textContent = error.message;
            console.error("Error Sending OTP:", error); // Debugging
        });
});

// Verify OTP
verifyOtpButton.addEventListener('click', () => {
    const otp = otpInput.value;

    if (!otp) {
        authMessage.textContent = 'Please enter the OTP.';
        return;
    }

    confirmationResult.confirm(otp)
        .then((result) => {
            const user = result.user;
            console.log("Phone Authentication Successful:", user); // Debugging
            saveUserData(user);
            showApp();
        })
        .catch((error) => {
            authMessage.textContent = error.message;
            console.error("Error Verifying OTP:", error); // Debugging
        });
});

// Save User Data to Firestore
function saveUserData(user) {
    db.collection('users').doc(user.uid).set({
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        balance: 0,
        miningProgress: 0,
        emailVerified: user.emailVerified || false
    }, { merge: true })
    .then(() => {
        console.log("User Data Saved to Firestore"); // Debugging
    })
    .catch((error) => {
        console.error("Error Saving User Data:", error); // Debugging
    });
}

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
