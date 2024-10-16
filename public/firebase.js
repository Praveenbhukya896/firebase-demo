// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCz2kAV9M3zkCtzNYEjwNeXOxZ03e6AvdQ",
    authDomain: "fir-project-e9669.firebaseapp.com",
    projectId: "fir-project-e9669",
    storageBucket: "fir-project-e9669.appspot.com",
    messagingSenderId: "310616472999",
    appId: "1:310616472999:web:864626ba607a9c6cdaca82",
    measurementId: "G-6FE62883KK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Firebase Analytics
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

// Export the initialized authentication and Firestore database
export { auth, db }; // Export the auth variable for use in other files

// Function to register a user
export async function registerUser(email, password, userData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
        email: email,
        disabilityType: userData.disabilityType,
        disabilityName: userData.disabilityName,
        levelOfDisability: userData.levelOfDisability,
        age: userData.age,
        gender: userData.gender
    });
}

// Function to log in a user
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Function to send password reset email
export function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
}

// Function to log in with Google
export function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}
