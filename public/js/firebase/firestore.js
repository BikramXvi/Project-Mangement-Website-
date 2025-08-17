// js/firebase/firestore.js
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, onSnapshot, getDoc, query, where } 
from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { auth, serverTimestamp } from "./config.js";

const db = getFirestore();
const projectsCol = collection(db, "projects");

// Create project
export async function createProject({ name, description, deadline, status, team=[] }) {
  if (!auth.currentUser) throw new Error("Login required");
  const creatorUid = auth.currentUser.uid;

  // Add creator UID to members
  const members = Array.from(new Set([creatorUid, ...team]));

  const docRef = await addDoc(projectsCol, {
    name,
    description: description || "",
    deadline: deadline || "",
    status: status || "planning",
    team: members,
    createdBy: creatorUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

// Fetch projects where current user is a member
export async function getUserProjects() {
  if (!auth.currentUser) throw new Error("Login required");
  const userUid = auth.currentUser.uid;

  const q = query(projectsCol, where("team", "array-contains", userUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Update project
export async function updateProject(projectId, data) {
  const projectRef = doc(projectsCol, projectId);
  await updateDoc(projectRef, { ...data, updatedAt: serverTimestamp() });
}

// Delete project
export async function deleteProject(projectId) {
  await deleteDoc(doc(projectsCol, projectId));
}

// Real-time listener for user projects
export function onProjectsChange(callback) {
  if (!auth.currentUser) return;
  const userUid = auth.currentUser.uid;
  const q = query(projectsCol, where("team", "array-contains", userUid));
  return onSnapshot(q, snap => {
    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(projects);
  });
}

// Tasks are stored in a subcollection under each project
function tasksColRef(projectId) {
  return collection(db, "projects", projectId, "tasks");
}

// Add a new task
export async function addTask(projectId, { title, description = "", status = "todo", assigned = [] }) {
  if (!auth.currentUser) throw new Error("Login required");
  const taskRef = await addDoc(tasksColRef(projectId), {
    title,
    description,
    status,
    assigned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: auth.currentUser.uid
  });
  return taskRef.id;
}

// Update existing task
export async function updateTask(projectId, taskId, data) {
  const taskRef = doc(tasksColRef(projectId), taskId);
  await updateDoc(taskRef, { ...data, updatedAt: serverTimestamp() });
}

// Delete task
export async function deleteTask(projectId, taskId) {
  const taskRef = doc(tasksColRef(projectId), taskId);
  await deleteDoc(taskRef);
}

// Real-time listener for tasks of a project
export function onTasksChange(projectId, callback) {
  const q = query(tasksColRef(projectId));
  return onSnapshot(q, snap => {
    const tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(tasks);
  });
}