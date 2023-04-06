import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoJqc8d05GWL1_1Cbi8QxvTeNWW4-nJG4",
  authDomain: "todolist-c40df.firebaseapp.com",
  projectId: "todolist-c40df",
  storageBucket: "todolist-c40df.appspot.com",
  messagingSenderId: "568938139964",
  appId: "1:568938139964:web:9959ab47d76aa4fe0c4e39",
  measurementId: "G-WJE084MB73",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get a reference to the Firestore database
const db = getFirestore();

// Get references to HTML elements
const taskList = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

// Listen for form submission
taskForm.addEventListener("submit", (e) => {
  // Prevent form from submitting
  e.preventDefault();

  // Get the task input value
  const taskText = taskInput.value.trim();

  // If task text is not empty, add the task to the database
  if (taskText !== "") {
    addDoc(collection(db, "tasks"), { text: taskText }).then((doc) => {
      const taskId = doc.id;

      const li = document.createElement("li");
      li.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-btn" data-task-id="${taskId}">Delete</button>
            `;
      taskList.appendChild(li);
      const deleteBtn = li.querySelector(".delete-btn");
      addDeleteListener(deleteBtn);
    });
  }
});

// Listen for real-time updates to the tasks collection
getDocs(collection(db, "tasks")).then((snapshot) => {
  // Clear the task list
  taskList.innerHTML = "";

  // Add each task to the task list
  snapshot.forEach((currentDoc) => {
    const task = currentDoc.data().text;
    const taskId = currentDoc.id;

    const li = document.createElement("li");
    li.innerHTML = `
            <span>${task}</span>
            <button class="delete-btn" data-task-id="${taskId}">Delete</button>
        `;
    taskList.appendChild(li);

    // Listen for click events on the delete button
    const deleteBtn = li.querySelector(".delete-btn");
    addDeleteListener(deleteBtn);
  });
});


function addDeleteListener(deleteBtn){
    deleteBtn.addEventListener("click", (e) => {
        // Get the task ID from the data attribute
        const taskId = e.target.getAttribute("data-task-id");
  
        // Delete the task from the database
        deleteDoc(doc(db, "tasks", taskId));
        // Delete the task visually
        deleteBtn.parentElement.remove();
      });
}