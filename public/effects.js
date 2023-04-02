const words = ['experience', 'website', 'universe'];
const rotatingWord = document.querySelector('.rotating-word');

let wordIndex = 0;

function updateWord() {
  rotatingWord.textContent = words[wordIndex];
  wordIndex = (wordIndex + 1) % words.length;
}

function changeWordWithFade() {
  rotatingWord.classList.add('fade-out'); // Add fade-out effect

  setTimeout(() => {
    rotatingWord.classList.remove('fade-out'); // Remove fade-out effect
    updateWord(); // Update the word
  }, 500); // Remove fade-out effect after 0.5 seconds
}

updateWord(); // Set the initial word

setInterval(() => {
  changeWordWithFade();
}, 4000); // Update the word every 5 seconds
