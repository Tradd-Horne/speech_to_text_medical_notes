let mediaRecorder;
let audioChunks = [];

document.getElementById('recordButton').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        processAudio(audioBlob);
    };

    document.getElementById('stopButton').disabled = false;
    document.getElementById('recordButton').disabled = true;
});

document.getElementById('stopButton').addEventListener('click', () => {
    mediaRecorder.stop();
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

    const extraNotes = document.getElementById('notes').value;
    formData.append('notes', extraNotes);

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    formData.append('csrfmiddlewaretoken', csrftoken);

    // Show the loading bar
    document.getElementById('loadingBarContainer').style.display = 'block';
    animateLoadingBar();

    const response = await fetch('/transcribe/', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();

    document.getElementById('transcript').innerText = "Transcript: " + result.transcript;
    document.getElementById('medical_note').innerText = "Medical Note: " + result.medical_note;
    document.getElementById('extra_notes').innerText = "Extra Notes: " + result.extra_notes;

    // Hide the loading bar after processing is complete
    document.getElementById('loadingBarContainer').style.display = 'none';
    resetLoadingBar();
}

function animateLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width++;
            loadingBar.style.width = width + '%';
        }
    }, 100); // Adjust the speed as needed
}

function resetLoadingBar() {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.style.width = '0%';
}
