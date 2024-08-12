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