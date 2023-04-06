// adding vocabulary

// Get the add vocabulary button and the popup
const addVocabButton = document.querySelector("#addVocabularyBtn");
const popup = document.querySelector("#addVocabularyPopup");

// Get the close button and the form inside the popup
const closeBtn = popup.querySelector(".close-btn");
const vocabForm = popup.querySelector("#addVocabularyForm");

// Add event listener to open popup when add vocabulary button is clicked
addVocabButton.addEventListener("click", () => {
  popup.classList.add("show");
});

// Add event listener to close popup when close button is clicked
closeBtn.addEventListener("click", () => {
  popup.classList.remove("show");
});

// Add event listener to close popup when user clicks outside the popup
window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.remove("show");
  }
});

// Add event listener to submit form data when user submits the form
vocabForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // TODO: handle form data
  // Hide popup after form is submitted
  popup.classList.remove("show");
});

// adding vocabulary to the database

async function saveWord(word, language) {
  try {
    const response = await fetch("/api/save-word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, language }),
    });
    const data = await response.json();
    console.log(data.message);
  } catch (err) {
    console.error("Error:", err);
  }
}

vocabForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const word = document.getElementById("newVocabulary").value;
  const language = document.getElementById("languageSelect").value;
  saveWord(word, language);
  popup.classList.remove("show");
});

// create the table in the vocabulary.html page
function createTable(data) {
    const table = document.getElementById("vocabularyTable");
    const tableHead = `
      <tr>
        <th>ID</th>
        <th>Word</th>
        <th>Language</th>
        <th>Delete</th>
      </tr>`;
    table.innerHTML = tableHead;
  
    data.forEach((row) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <td>${row.id}</td>
        <td>${row.word}</td>
        <td>${row.language}</td>
        <td><button class="delete-btn" data-id="${row.id}">x</button></td>`;
      table.appendChild(tableRow);
    });
  }
  
// Fetch words from the database
async function fetchWords() {
  try {
    const response = await fetch("/api/get-words");
    const data = await response.json();
    createTable(data.words);
  } catch (err) {
    console.error("Error:", err);
  }
}

// Delete a word from the database
async function deleteWord(id) {
    try {
      const response = await fetch(`/api/delete-word/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error("Error:", err);
    }
  }

  // Event listener for delete buttons
  const table = document.getElementById("vocabularyTable");
table.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    await deleteWord(id);
    e.target.parentElement.parentElement.remove();
  }
});

  

// Call fetchWords on page load or when you want to update the table
fetchWords();
