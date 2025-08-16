// js/firebase/projects.js
import { db, collections, serverTimestamp } from "./config.js";
import { 
  addDoc, updateDoc, doc, query, where, onSnapshot, arrayUnion, getDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

/**
 * Create a new project with the creator automatically assigned
 * @param {string} name - Project name
 * @param {string} description - Project description
 * @param {string} createdBy - UID of the creator
 */
export async function createProject({ name, description, createdBy }) {
  try {
    const docRef = await addDoc(collections.projects, {
      name,
      description,
      createdBy,
      members: [createdBy], // Creator automatically assigned
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("✅ Project created with ID:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("❌ Failed to create project:", err);
  }
}

/**
 * Add one or more users to an existing project
 * @param {string} projectId - Firestore project document ID
 * @param {array} newMembers - Array of user UIDs to add
 */
export async function addUsersToProject(projectId, newMembers) {
  try {
    const projectRef = doc(collections.projects, projectId);
    await updateDoc(projectRef, {
      members: arrayUnion(...newMembers),
      updatedAt: serverTimestamp()
    });
    console.log("✅ Users added to project:", projectId);
  } catch (err) {
    console.error("❌ Failed to add users:", err);
  }
}

/**
 * Listen to projects where the current user is a member
 * @param {string} userId - UID of the logged-in user
 * @param {function} callback - Called with array of projects in real-time
 */
export function listenToUserProjects(userId, callback) {
  const q = query(collections.projects, where("members", "array-contains", userId));

  return onSnapshot(q, snapshot => {
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(projects);
  });
}

/**
 * Fetch project data by ID
 * @param {string} projectId 
 */
export async function getProjectById(projectId) {
  const projectRef = doc(collections.projects, projectId);
  const docSnap = await getDoc(projectRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

/**
 * Update project details
 * @param {string} projectId 
 * @param {object} updates 
 */
export async function updateProject(projectId, updates) {
  try {
    const projectRef = doc(collections.projects, projectId);
    await updateDoc(projectRef, { ...updates, updatedAt: serverTimestamp() });
    console.log("✅ Project updated:", projectId);
  } catch (err) {
    console.error("❌ Failed to update project:", err);
  }
}

/**
 * Delete a project
 * @param {string} projectId 
 */
export async function deleteProject(projectId) {
  try {
    const projectRef = doc(collections.projects, projectId);
    await updateDoc(projectRef, { status: "deleted", updatedAt: serverTimestamp() });
    console.log("✅ Project marked as deleted:", projectId);
  } catch (err) {
    console.error("❌ Failed to delete project:", err);
  }
}
