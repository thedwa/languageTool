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
        "messages": [{"role": "user", "content": `Schreibe mir einen ${languageMC} Lückentext im untenstehenden Format. 
        Der Lückentext soll genau ${gapsMC} Lücken haben, ist auf ${languageMC} geschrieben und die Lücken sind jeweils konjugierte Verben (nur die Verben ${verbsMC}, in Einzahl und Mehrzahl). 
        Schreibe dem Text auf dem Sprachniveau ${levelMC} in der Zeitform ${timeMC}. 
        Format:
        Text: Ich ___(1) Geburtstag. Ich ___(2) 30 Jahre alt.
        Lösung: 
        (1) habe
        (2) werde
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
      console.log(data);
      
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