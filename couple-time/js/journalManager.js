import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

// Add Journal Entry
export async function addJournalEntry(userId, entry) {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "journal"), {
      ...entry,
      timestamp: new Date(),
      colorTheme: getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-brown').trim()
    });
    console.log("Entry added with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding entry: ", error);
    throw error;
  }
}

// Get Journal Entries
export async function getJournalEntries(userId) {
  const entries = [];
  const querySnapshot = await getDocs(collection(db, "users", userId, "journal"));
  
  querySnapshot.forEach((doc) => {
    entries.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return entries.sort((a, b) => b.timestamp - a.timestamp);
}

// Local Storage Fallback
export function getLocalEntries() {
  const entries = JSON.parse(localStorage.getItem('coupleTimeJournal') || '[]');
  return entries.map(entry => ({
    ...entry,
    timestamp: new Date(entry.timestamp)
  }));
}