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

    const languagePrompts = {
        "German": `Schreibe mir einen ${languageMC} Lückentext im untenstehenden Format. Der Lückentext soll genau ${gapsMC} Sätze mit Lücken haben, ist auf ${languageMC} geschrieben und die Lücken sind jeweils konjugierte Verben (nur die Verben "${verbsMC}", in Einzahl und Mehrzahl). Schreibe dem Text auf dem Sprachniveau ${levelMC} in der Zeitform ${timeMC}.
        Format: Die Lücken sollten jeweils drei "_" haben, und danach die Lückennummer in Klammern ()
        Text: Ich ___(1) Geburtstag. Ich ___(2) 30 Jahre alt.
        Lösung:
        (1) habe
        (2) werde`,
            "English": `Write a ${languageMC} gap text in the following format. The gap text should have exactly ${gapsMC} sentences with gaps, is written in ${languageMC}, and the gaps are conjugated verbs (only the verbs "${verbsMC}", in singular and plural). Write the text at the ${levelMC} language level in the ${timeMC} tense.
        Format: The gaps should have three "_" each, and then the gap number in parentheses ()
        Text: I ___(1) a birthday. I ___(2) 30 years old.
        Solution:
        (1) have
        (2) am turning`,
            "French": `Écris un texte à trous en ${languageMC} dans le format suivant. Le texte à trous doit avoir exactement ${gapsMC} phrases avec trous (ni plus ni moins), est écrit en ${languageMC} et les trous sont des verbes conjugués (seulement les verbes "${verbsMC}", au singulier et au pluriel). Écris le texte au niveau de langue ${levelMC} au temps ${timeMC}.
        Exemple de format (Crée un texte avec ${gapsMC} trous): Les espaces doivent avoir trois "_" chacun, suivis du numéro de l'espace entre parenthèses ()
        Texte: J'___(1) anniversaire. J'___(2) 30 ans.
        Solution:
        (1) ai
        (2) aurai`,
            "Italian": `Scrivi un testo con lacune in ${languageMC} nel seguente formato. Il testo con lacune deve avere esattamente ${gapsMC} frasi con lacune, è scritto in ${languageMC} e le lacune sono verbi coniugati (solo i verbi "${verbsMC}", al singolare e al plurale). Scrivi il testo al livello di lingua ${levelMC} nel tempo ${timeMC}.
        Formato: Le lacune devono avere tre "_" ciascuna e poi il numero della lacuna tra parentesi ().
        Testo: Io ___(1) compleanno. Io ___(2) 30 anni.
        Soluzione:
        (1) ho
        (2) compio`,
            "Spanish": `Escribe un texto con huecos en ${languageMC} en el siguiente formato. El texto con huecos debe tener exactamente ${gapsMC} frases con huecos, está escrito en ${languageMC} y los huecos son verbos conjugados (solo los verbos "${verbsMC}", en singular y plural). Escribe el texto en el nivel de lengua ${levelMC} en el tiempo ${timeMC}.
        Formato: Los espacios deben tener tres "_" cada uno y, a continuación, el número de espacio entre paréntesis ()
        Texto: Yo ___(1) cumpleaños. Yo ___(2) 30 años.
        Solución:
        (1) tengo
        (2) cumplo`,
        "Dutch": `Schrijf een ${languageMC} tekst met lege plekken in het volgende formaat. De tekst met lege plekken moet precies ${gapsMC} zinnen met lege plekken bevatten, is geschreven in ${languageMC} en de lege plekken zijn vervoegde werkwoorden (alleen de werkwoorden "${verbsMC}", enkelvoud en meervoud). Schrijf de tekst op het ${levelMC} taalniveau in de ${timeMC} tijd.
        Formaat: De openingen moeten elk drie "_" hebben, en dan het nummer van de opening tussen haakjes ()
        Tekst: Ik ___(1) verjaardag. Ik ___(2) 30 jaar oud.
        Oplossing:
        (1) heb
        (2) word`
    };
    const generalizedLanguagePrompt = 
    `Your task is to wrote a gap text for a language students for them to practice conjugating verbs.
    Write the text in ${languageMC}, with ${gapsMC} gaps, with language level ${levelMC}, in the time format ${timeMC}.
    The gaps are conjugations of the verb(s) "${verbsMC}".

    Use the following format:
    The gaps should have three "_" each, and then the gap number in parentheses ()
    under the title "Solution", you have the conjugated verbs with the gap number in parentheses, and the correct conjugation in the next line.
    Example:
    Text: I ___(1) a birthday. I ___(2) 30 years old.
    Solution:
    (1) have
    (2) am turning`;

    console.log("the prompt  is: ");
      
      //const prompt = languagePrompts[languageMC];
      const prompt = generalizedLanguagePrompt;

      
      console.log(prompt);
      const data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": `${prompt} 

        `}],
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
      const gapText = json.choices && json.choices.length > 0 ? json.choices[0].message.content.trim() : 'No solution found.';
      console.log("the solution is: ")
      console.log(gapText);

      solutionText.innerHTML = `<ul class="solution-list">
                                    <li><strong>Verb:</strong> ${verbsMC}</li>
                                    <li><strong>Level:</strong> ${levelMC}</li>
                                    <li><strong>Time:</strong> ${timeMC}</li>
                                </ul>`
                                //<div class="solution-block">
                                //    <h3>Solution:</h3>
                                //    <p>${gapText.replace(/\n/g, '<br>')}</p>
                                //</div>
                                ;
       setLoading(false); // Hide the overlay and spinner


      // create the "gap text" for the user

        // Split the input string into text and solution
        function splitInputIntoTextAndSolution(inputString) {
            // Split the input string into text and solution
            // Match different variations of 'Text' and 'Solution' keywords
            const [_, text, solutionString] = inputString.match(/(?:Text|Texte|Texto|Testo|Tekst):([\s\S]*?)(?:Lösung|Solution|Solución|Soluzione|Oplossing):([\s\S]*)/);
          
            // Extract the solution words from the solution string
            const solution = {};
            solutionString.replace(/\((\d+)\)\s*(\S+)/g, (_, number, word) => {
              solution[number] = word;
            });
          
            return [text, solution];
          }

        const [text, solution] = splitInputIntoTextAndSolution(gapText);

          
        // Now, use the 'text' and 'solution' variables in the previous example
        // Replace placeholders with input fields
        const gapTextWithInputs = text.replace(/___\((\d+)\)/g, (_, number) => {
        return `<input type="text" data-number="${number}" class="gap-input" size="8">`;
        });


        const gapTextElement = document.getElementById("gapText");
        gapTextElement.innerHTML = gapTextWithInputs;

        // Handle the "Show Solution" button click
        const showSolutionBtn = document.getElementById("showSolutionBtn");
        const feedbackElement = document.getElementById("feedback");

        showSolutionBtn.addEventListener("click", () => {
        const inputs = document.getElementsByClassName("gap-input");
        let correctAnswers = 0;
        let feedback = "";

        for (const input of inputs) {
            const number = input.getAttribute("data-number");
            const userAnswer = input.value.trim();

            if (userAnswer === solution[number]) {
            feedback += `(${number}) ✅ Correct! <br>`;
            correctAnswers++;
            } else {
            feedback += `(${number}) ❌ Incorrect. The correct answer is "${solution[number]}".<br>`;
            }
        }

        feedback += `You got ${correctAnswers} out of ${inputs.length} correct!`;
        feedbackElement.innerHTML = feedback;
        });



       
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