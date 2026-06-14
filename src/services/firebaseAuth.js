import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  verifyBeforeUpdateEmail,
  signOut, 
  onAuthStateChanged,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { app, db } from './firebase/firebaseConfig.js';

export const auth = getAuth(app);

/**
 * Sign in existing user
 */
export async function signInWithEmailPassword(email, password) {
  console.log(`🔥 Firebase Auth: Attempting login for [${email}]...`);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log(`✅ Firebase Auth: Login successful! UID:`, userCredential.user.uid);
  return userCredential.user;
}

/**
 * Register new user, create their Firestore document, and send verification email
 */
export async function registerWithEmailPassword(email, password) {
  console.log(`🔥 Firebase Auth: Attempting signup for [${email}]...`);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  console.log(`✅ Firebase Auth: Signup successful! Auth UID created:`, user.uid);
  
  // Create the Firestore document in the 'users' collection
  console.log(`🔥 Firebase Request: Creating users document for [${user.uid}]...`);
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    createdAt: serverTimestamp(),
    onboardingPhase: 'diagnostic_pending', // Assume they need to take the diagnostic right after signup
    preferences: null
  });
  console.log(`✅ Firebase Response: Successfully created users/${user.uid} document!`);

  return user;
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(user) {
  await sendEmailVerification(user);
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Request an email change (sends verification to new email before updating)
 */
export async function requestEmailChange(user, newEmail) {
  await verifyBeforeUpdateEmail(user, newEmail);
}

/**
 * Sign out current user
 */
export async function logOut() {
  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Anonymous sign in (placeholder logic matching previous stubs)
 */
export async function signInAnonymouslyStub() {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

export function getCurrentUserId() {
  return auth.currentUser?.uid ?? 'guest';
}
