let generatedSolution = "";

document.getElementById('ttsForm').addEventListener('submit', async (event) => {
    setLoading(true);
    event.preventDefault();

    const languageMC = document.getElementById("languageMC").value;
    const timeMC = document.getElementById("timeMC").value;
    const lengthMC = document.getElementById("lengthMC").value;
    const levelMC = document.getElementById("levelMC").value;
    const topicInput = document.getElementById("topicInput").value;

    const languagePrompts = {
        "German": `Verhalte dich wie ein Lehrer. Schreibe einen Text auf ${languageMC} mit ungefähr ${lengthMC} Wörter auf dem Sprachniveau ${levelMC}. Brauche die Zeitform ${timeMC}. Stelle dann 5 Fragen zum Inhalt vom Text. Dabei geht es um das Thema ${topicInput}`,
        "English": `Act like a teacher. Write a text in ${languageMC} with about ${lengthMC} words on the language level ${levelMC}. Use the time form ${timeMC}. Then ask 5 questions about the content of the text. It's about the topic ${topicInput}`,
        "French": `Agissez comme un professeur. Écrivez un texte en ${languageMC} avec environ ${lengthMC} mots au niveau de langue ${levelMC}. Utilisez la forme temporelle ${timeMC}. Posez ensuite 5 questions sur le contenu du texte. Il s'agit du sujet ${topicInput}`,
        "Spanish": `Actúa como un profesor. Escribe un texto en ${languageMC} con aproximadamente ${lengthMC} palabras en el nivel de idioma ${levelMC}. Utilice la forma temporal ${timeMC}. Luego haga 5 preguntas sobre el contenido del texto. Se trata del tema ${topicInput}`,
        "Italian": `Agisci come un insegnante. Scrivi un testo in ${languageMC} con circa ${lengthMC} parole al livello linguistico ${levelMC}. Usa il tempo ${timeMC}. Poi fai 5 domande sul contenuto del testo. È un argomento ${topicInput}`,
        "Dutch": `Doe alsof je een leraar bent. Schrijf een tekst in ${languageMC} met ongeveer ${lengthMC} woorden op het taalniveau ${levelMC}. Gebruik de tijdvorm ${timeMC}. Stel dan 5 vragen over de inhoud van de tekst. Het gaat over het onderwerp ${topicInput}`,
    };

    const languageVoices = {
        "German": "de-DE_BirgitV3Voice",
        "English": "en-US-MichelleNeural",
        "French": "fr-FR-Standard-A",
        "Spanish": "Enrique",
        "Italian": "it-IT-Wavenet-A",
        "Dutch": "nl-NL-Wavenet-B",
      };
    
    
    const generateTextRadio = document.getElementById("generateText");
    if (generateTextRadio.checked) {
        const prompt = languagePrompts[languageMC];
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
        generatedSolution = solution;
    }


    function getText() {
        const enterOwnTextRadio = document.getElementById("enterOwnText");
        const generateTextRadio = document.getElementById("generateText");

        if (enterOwnTextRadio.checked) {
            const text = document.getElementById("text").value;
            generatedSolution = text;
            return text;
        } else if (generateTextRadio.checked) {
            const generatedText = generatedSolution;
            return generatedText;
        }
    }


    const text = getText();
    console.log(`Text to convert: ${text}`);



  
    if (text) {
        const voice = languageVoices[languageMC];
        const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, voice })
          });
  
      const data = await response.json();
  
      if (data.transcriptionId) {
        checkAudioStatus(data.transcriptionId);
      } else {
        setLoading(false);
      }
    }
  });
  
  async function fetchAudioUrl(transcriptionId) {
    try {
      const response = await fetch(`/api/audio-status/${transcriptionId}`);
      const data = await response.json();
  
      if (data.converted) { // Change this line from 'if (data.status === 'COMPLETED') {'
        return data.audioUrl;
      }
    } catch (error) {
      console.error('Error fetching audio status:', error);
    }
  
    return null;
  }
  
  async function checkAudioStatus(transcriptionId) {
    const interval = setInterval(async () => {
      const audioUrl = await fetchAudioUrl(transcriptionId);
  
      if (audioUrl) {
        clearInterval(interval);
        const audioSource = document.getElementById('audioSource');
        audioSource.src = audioUrl;
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.load();
        // Remove this line: audioPlayer.play();
        setLoading(false);
      }
    }, 5000); // Check the audio status every 5 seconds
  }
  
  
//loader & spinner
function setLoading(loading) {
    const overlay = document.querySelector('.overlay');
    if (loading) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
};


// toggle between own text and text generation
function toggleInputOption() {
    const enterOwnText = document.getElementById('enterOwnText');
    const enterOwnTextSection = document.getElementById('enterOwnTextSection');
    const generateTextSection = document.getElementById('generateTextSection');

    if (enterOwnText.checked) {
        enterOwnTextSection.style.display = 'block';
        generateTextSection.style.display = 'none';
    } else {
        enterOwnTextSection.style.display = 'none';
        generateTextSection.style.display = 'block';
    }
}


//expand section with the written text
const revealBtn = document.getElementById('expandButton'); // Update the selector
revealBtn.addEventListener('click', () => {
  const revealTextSection = document.querySelector('.reveal-text-section');
  const revealText = document.querySelector('.reveal-text');

  if (revealTextSection.style.display === 'none') {
    revealTextSection.style.display = 'block';
    revealText.textContent = generatedSolution; // Use the global variable here
    revealBtn.textContent = 'Hide Text';
  } else {
    revealTextSection.style.display = 'none';
    revealBtn.textContent = 'Reveal Text';
  }
});
