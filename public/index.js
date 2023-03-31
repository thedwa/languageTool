
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.gap-text-form');
    const solutionText = document.querySelector('.solution-text');

    form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const languageMC = document.querySelector('#languageMC').value;
    const gapsMC = document.querySelector('#gapsMC').value;
    const levelMC = document.querySelector('#levelMC').value;
    const timeMC = document.querySelector('#timeMC').value;
    const verbsMC = [...document.querySelector('#verbsMC').selectedOptions].map(option => option.value).join(", ");

    const data = {
        prompt: `Generate a gap text in ${languageMC}, with ${gapsMC} gaps, and language level ${levelMC}. Use ${timeMC} and the following verbs: ${verbsMC}.`,
        max_tokens: 50,
        temperature: 0.7,
        n: 1,
        stop: "\n"
    };

    const response = await fetch('/api/generate-gap-text', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    

    const json = await response.json();
    const solution = json.choices[0].text.trim();

    solutionText.textContent = `Solution: ${solution}`;
    });
});
