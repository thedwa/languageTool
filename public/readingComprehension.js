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

      const languagePrompts = {
        "German": `Verhalte dich wie ein Lehrer. Schreibe einen Text auf ${languageMC} mit ungefähr ${lengthMC} Wörter auf dem Sprachniveau ${levelMC}. Brauche die Zeitform ${timeMC}. Stelle dann 5 Fragen zum Inhalt vom Text. Dabei geht es um das Thema ${topicInput}`,
        "English": `Act like a teacher. Write a text in ${languageMC} with about ${lengthMC} words on the language level ${levelMC}. Use the time form ${timeMC}. Then ask 5 questions about the content of the text. It's about the topic ${topicInput}`,
        "French": `Agissez comme un professeur. Écrivez un texte en ${languageMC} avec environ ${lengthMC} mots au niveau de langue ${levelMC}. Utilisez la forme temporelle ${timeMC}. Posez ensuite 5 questions sur le contenu du texte. Il s'agit du sujet ${topicInput}`,
        "Spanish": `Actúa como un profesor. Escribe un texto en ${languageMC} con aproximadamente ${lengthMC} palabras en el nivel de idioma ${levelMC}. Utilice la forma temporal ${timeMC}. Luego haga 5 preguntas sobre el contenido del texto. Se trata del tema ${topicInput}`,
        "Italian": `Agisci come un insegnante. Scrivi un testo in ${languageMC} con circa ${lengthMC} parole al livello linguistico ${levelMC}. Usa il tempo ${timeMC}. Poi fai 5 domande sul contenuto del testo. È un argomento ${topicInput}`,
        "Dutch": `Doe alsof je een leraar bent. Schrijf een tekst in ${languageMC} met ongeveer ${lengthMC} woorden op het taalniveau ${levelMC}. Gebruik de tijdvorm ${timeMC}. Stel dan 5 vragen over de inhoud van de tekst. Het gaat over het onderwerp ${topicInput}`,
    };
    
    const prompt = languagePrompts[languageMC];
    console.log(`prompt: ${prompt}`);
    
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": `${prompt} 

        `}],
        "temperature": 0.7
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
          displayQuestionsWithInputs(solution); // Call the function to display questions with input fields and a button
          });
   }

   function splitSolutionIntoTextAndQuestions(solution) {
    const lines = solution.split('\n');
    const text = lines.slice(0, -6).join('\n');
    const questions = lines.slice(-5);
    return [text, questions];
}

function displayQuestionsWithInputs(solution) {
  const [text, questions] = splitSolutionIntoTextAndQuestions(solution);
  const questionsWithInputs = questions.map((question, index) => {
      return `<p>${question}<input type="text" class="answer-input" data-question-number="${index + 1}"></p>`;
  }).join('');

  solutionTextBlock.innerHTML = `
      <div class="solution-block">
          <h3>Text:</h3>
          <p>${text.replace(/\n/g, '<br>')}</p>
          <h3 id="questionsh3" >Questions:</h3>
          ${questionsWithInputs}
          <button class="smallButton">Submit Answers</button>
      </div>
  `;
    // Add event listener to the 'submit answers' button
    document.querySelector('.submit-answers').addEventListener('click', async () => {
      const answerInputs = document.querySelectorAll('.answer-input');
      const answers = Array.from(answerInputs).map(input => input.value);

      // Send the text and answers to the OpenAI API for correction
      const correctedAnswers = await sendAnswersForCorrection(text, questions, answers);

      // Display corrected answers
      const correctedAnswersHTML = correctedAnswers.map((answer, index) => `<p>${index + 1}. ${answer}</p>`).join('');
      solutionTextBlock.insertAdjacentHTML('beforeend', `<div class="corrected-answers"><h3>Corrected Answers:</h3>${correctedAnswersHTML}</div>`);
  });
}



//loader & spinner
function setLoading(loading) {
  const overlay = document.querySelector('.overlay');
  if (loading) {
      overlay.style.display = 'flex';
  } else {
      overlay.style.display = 'none';
  }
}



