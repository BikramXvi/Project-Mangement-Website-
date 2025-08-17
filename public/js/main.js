// In main.js
import "./ui/modal.js";
import "./ui/projects.js";
import "./ui/tasks.js";

import { addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { collections, serverTimestamp } from "./config.js";

async function testAddProject() {
  const ref = await addDoc(collections.projects, {
    name: "My First Project",
    description: "Learning Firestore!",
    createdAt: serverTimestamp()
  });
  console.log("Project created with ID:", ref.id);
}

testAddProject();
