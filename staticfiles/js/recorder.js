let mediaRecorder;
let audioChunks = [];
let timerInterval;
let seconds = 0;
let minutes = 0;

document.getElementById('recordButton').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    
    // Reset timer
    seconds = 0;
    minutes = 0;
    document.getElementById('timer').innerText = "00:00";
    
    // Start the timer
    timerInterval = setInterval(updateTimer, 1000);
    
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        clearInterval(timerInterval);  // Stop the timer
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        processAudio(audioBlob);
    };

    document.getElementById('stopButton').disabled = false;
    document.getElementById('recordButton').disabled = true;
});

document.getElementById('stopButton').addEventListener('click', () => {
    mediaRecorder.stop();
    clearInterval(timerInterval);  // Stop the timer
    document.getElementById('stopButton').disabled = true;
    document.getElementById('recordButton').disabled = false;
});

document.getElementById('audioUpload').addEventListener('change', () => {
    document.getElementById('uploadButton').disabled = false;
});

document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('audioUpload');
    const audioBlob = fileInput.files[0];
    processAudio(audioBlob);
});

async function processAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    // Get the CSRF token from the cookie
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    formData.append('csrfmiddlewaretoken', csrftoken);

    const response = await fetch('/transcribe/', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    document.getElementById('transcript').innerText = "Transcript: " + result.transcript;
    document.getElementById('medical_note').innerText = "Medical Note: " + result.medical_note;
}

// Timer function to update the time display
function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    
    let minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    let secondsStr = seconds < 10 ? `0${seconds}` : seconds;
    
    document.getElementById('timer').innerText = `${minutesStr}:${secondsStr}`;
}
