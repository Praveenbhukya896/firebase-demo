// Import the functions you need from the SDKs
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

// Function to register a regular user
export async function registerUser(email, password, userData) {
    try {
        console.log("Attempting to register user with email:", email);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User registered successfully:", user.uid);

        // Validate userData
        if (!userData.disabilityType || !userData.disabilityName) {
            console.error("Missing required user data.");
            throw new Error("Invalid user data");
        }

        // Store user data in the "users" collection in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            disabilityType: userData.disabilityType,
            disabilityName: userData.disabilityName,
            levelOfDisability: userData.levelOfDisability,
            age: userData.age,
            gender: userData.gender,
            role: "user"  // Specify user role
        });
        console.log("User data stored successfully in Firestore.");
    } catch (error) {
        console.error("Error registering user: ", error);
        throw error;
    }
}

// Function to register a trainer
export async function registerTrainer(email, password, trainerData) {
    try {
        console.log("Attempting to register trainer with email:", email);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("Trainer registered successfully:", user.uid);

        // Store trainer data in the "trainers" collection in Firestore
        await setDoc(doc(db, "trainers", user.uid), {
            email: email,
            specialization: trainerData.specialization,
            experienceLevel: trainerData.experienceLevel,
            certifications: trainerData.certifications,
            availableModes: trainerData.availableModes, // For example, online or in-person training
            role: "trainer"  // Specify trainer role
        });
        console.log("Trainer data stored successfully in Firestore.");
    } catch (error) {
        console.error("Error registering trainer: ", error);
        throw error;
    }
}

// Function to log in a user (either regular user or trainer)
export async function loginUser(email, password) {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error logging in: ", error);
        throw error;
    }
}

// Function to send password reset email
export function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
}

// Function to log in with Google
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        return await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error logging in with Google: ", error);
        throw error;
    }
}
