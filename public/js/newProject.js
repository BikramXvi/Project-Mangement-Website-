import { auth, collections } from "./config.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { createProject, addUsersToProject } from "./projects.js";

// Elements
const newProjectBtn = document.getElementById("newProjectBtn");
const projectModal = document.getElementById("projectModal");
const closeModal = document.getElementById("closeModal");
const createProjectForm = document.getElementById("createProjectForm");
const projectMembers = document.getElementById("projectMembers");

// Open modal
newProjectBtn.addEventListener("click", async () => {
  projectModal.style.display = "flex";

  // Populate users dynamically
  projectMembers.innerHTML = "";
  const snapshot = await getDocs(collections.users);
  snapshot.forEach(doc => {
    const user = doc.data();
    const option = document.createElement("option");
    option.value = user.uid;
    option.textContent = user.name;
    projectMembers.appendChild(option);
  });
});

// Close modal
closeModal.addEventListener("click", () => projectModal.style.display = "none");
window.addEventListener("click", e => {
  if (e.target === projectModal) projectModal.style.display = "none";
});

// Handle form submission
createProjectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("projectName").value;
  const description = document.getElementById("projectDescription").value;
  const selectedOptions = Array.from(projectMembers.selectedOptions);
  const additionalUsers = selectedOptions.map(opt => opt.value);

  const creatorUid = auth.currentUser.uid;

  // Create project
  const projectId = await createProject({ name, description, createdBy: creatorUid });

  // Add additional users (including creator)
  await addUsersToProject(projectId, [creatorUid, ...additionalUsers]);

  alert("Project created successfully!");
  createProjectForm.reset();
  projectModal.style.display = "none";
});
