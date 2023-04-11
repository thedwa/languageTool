document.getElementById('ttsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = document.getElementById('text').value;
  
    if (text) {
      setLoading(true);
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
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
