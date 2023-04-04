

document.addEventListener('DOMContentLoaded', () => {

    //gap text
    const form = document.querySelector('.gap-text-form');
    const solutionText = document.querySelector('.solution-text');

    if (form) {
        form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true); // Show the overlay and spinner

    const languageMC = document.querySelector('#languageMC').value;
    const gapsMC = document.querySelector('#gapsMC').value;
    const levelMC = document.querySelector('#levelMC').value;
    const timeMC = document.querySelector('#timeMC').value;
    const verbsMC = [...document.querySelector('#verbsMC').selectedOptions].map(option => option.value).join(", ");

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": `Schreibe einen Lückentext auf ${languageMC} mit genau ${gapsMC} Lücken (nicht mehr und nicht weniger) auf dem Sprachniveau ${levelMC}. Brauche die Zeitform ${timeMC}. In den Lücken sollte das konjugierte Verb ${verbsMC} in Einzahl oder Mehrzahl sein. Liste weiter unten sämtliche fehlenden konjugierten Verben in der richtigen Reihenfolge auf, welche den Text vervollständigen!`}],
        "temperature": 0.1
      }
      
      const response = await fetch('/api/generate-gap-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const json = await response.json();
      const solution = json.choices && json.choices.length > 0 ? json.choices[0].message.content.trim() : 'No solution found.';
      console.log("the solution is: ")
      console.log(solution);

      solutionText.innerHTML = `<ul class="solution-list">
                                    <li><strong>Verb:</strong> ${verbsMC}</li>
                                    <li><strong>Level:</strong> ${levelMC}</li>
                                    <li><strong>Time:</strong> ${timeMC}</li>
                                </ul>
                                <div class="solution-block">
                                    <h3>Solution:</h3>
                                    <p>${solution.replace(/\n/g, '<br>')}</p>
                                </div>
                                `;
       setLoading(false); // Hide the overlay and spinner
    });
}



    // block text
    const formBlock = document.querySelector('.block-text-form');
    const solutionTextBlock = document.querySelector('.solution-text');

    if (formBlock) {
        formBlock.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true); // Show the overlay and spinner


    const languageMC = document.querySelector('#languageMC').value;
    const lengthMC = document.querySelector('#lengthMC').value;
    const levelMC = document.querySelector('#levelMC').value;
    const timeMC = document.querySelector('#timeMC').value;
    const topicInput = document.querySelector('#topicInput').value;

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": `Verhalte dich wie ein Lehrer. Schreibe einen Text auf ${languageMC} mit ungefähr ${lengthMC} Wörter auf dem Sprachniveau ${levelMC}. 
        Brauche die Zeitform ${timeMC}. Stelle dann 5 Fragen zum Inhalt vom Text. Dabei geht es um das Thema ${topicInput}`}],
        "temperature": 0.1
      }
      console.log(data.messages);
      
      const response = await fetch('/api/generate-gap-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const json = await response.json();
      const solution = json.choices && json.choices.length > 0 ? json.choices[0].message.content.trim() : 'No solution found.';
      console.log("the solution is: ")
      console.log(solution);

      solutionTextBlock.innerHTML = `<div class="solution-block">
                                    <h3>Solution:</h3>
                                    <p>${solution.replace(/\n/g, '<br>')}</p>
                                </div>
                                `;
       setLoading(false); // Hide the overlay and spinner
    });
}
});



//loader & spinner
function setLoading(loading) {
    const overlay = document.querySelector('.overlay');
    if (loading) {
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
    }
  };
  

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // adding vocaboluary

  // Get the add vocabulary button and the popup
const addVocabButton = document.querySelector('#addVocabularyBtn');
const popup = document.querySelector('#addVocabularyPopup');

// Get the close button and the form inside the popup
const closeBtn = popup.querySelector('.close-btn');
const vocabForm = popup.querySelector('#addVocabularyForm');

// Add event listener to open popup when add vocabulary button is clicked
addVocabButton.addEventListener('click', () => {
  popup.classList.add('show');
});

// Add event listener to close popup when close button is clicked
closeBtn.addEventListener('click', () => {
  popup.classList.remove('show');
});

// Add event listener to close popup when user clicks outside the popup
window.addEventListener('click', (e) => {
  if (e.target === popup) {
    popup.classList.remove('show');
  }
});

// Add event listener to submit form data when user submits the form
vocabForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO: handle form data
  // Hide popup after form is submitted
  popup.classList.remove('show');
});


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// adding vocaboluary to the database

async function saveWord(word, language) {
    try {
      const response = await fetch('/api/save-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, language }),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error('Error:', err);
    }
  }
  
  vocabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = document.getElementById('newVocabulary').value;
    const language = document.getElementById('languageSelect').value; // Assuming the dropdown has an ID of 'languageSelect'
    saveWord(word, language);
    popup.classList.remove('show');
  });
  

  // create the table in the vocabulary.html page
  function createTable(data) {
    const table = document.getElementById('vocabularyTable');
    const tableHead = `
      <tr>
        <th>ID</th>
        <th>Word</th>
        <th>Language</th>
      </tr>`;
    table.innerHTML = tableHead;
  
    data.forEach((row) => {
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <td>${row.id}</td>
        <td>${row.word}</td>
        <td>${row.language}</td>`;
      table.appendChild(tableRow);
    });
  }
  
  async function fetchWords() {
    try {
      const response = await fetch('/api/get-words');
      const data = await response.json();
      createTable(data.words);
    } catch (err) {
      console.error('Error:', err);
    }
  }
  

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// multiselect for verb dropdown
const selectElement = document.getElementById('verbsMC');
const options = selectElement.getElementsByTagName('option');

for (let i = 0; i < options.length; i++) {
  const option = options[i];
  const checkbox = document.createElement('input');
  const text = document.createElement('span');

  checkbox.type = 'checkbox';
  checkbox.className = 'select-checkbox';
  checkbox.onclick = function() {
    option.selected = checkbox.checked;
  };

  text.className = 'select-option-text';
  text.textContent = option.textContent;

  option.textContent = '';
  option.appendChild(checkbox);
  option.appendChild(text);
}


  // Call fetchWords on page load or when you want to update the table
  fetchWords();
  
