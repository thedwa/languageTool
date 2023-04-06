
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




//loader & spinner
function setLoading(loading) {
    const overlay = document.querySelector('.overlay');
    if (loading) {
      overlay.style.display = 'flex';
    } else {
      overlay.style.display = 'none';
    }
  };