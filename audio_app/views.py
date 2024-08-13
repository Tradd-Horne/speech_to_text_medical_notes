from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import whisper
from django.core.files.storage import FileSystemStorage
import openai
import os
from dotenv import load_dotenv
import time


# Load environment variables from the .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def index(request):
    return render(request, "audio_app/index.html")


@csrf_exempt
def transcribe(request):
    if request.method == "POST" and request.FILES.get("audio"):
        audio_file = request.FILES["audio"]
        extra_notes = request.POST.get("notes", "")

        fs = FileSystemStorage()
        filename = fs.save(audio_file.name, audio_file)
        audio_path = fs.path(filename)

        start_time_whisper = time.time()
        model = whisper.load_model("tiny")
        result = model.transcribe(audio_path)
        end_time_whisper = time.time()
        whisper_duration = end_time_whisper - start_time_whisper
        transcript = result["text"]
        fs.delete(filename)  # Delete the file after processing

        # Prepare the message for the GPT model
        messages = [
            {
                "role": "system",
                "content": "You are a world-class podiatrist with expertise in medical documentation.",
            },
            {
                "role": "user",
                "content": (
                    "Extract the relevant medical information from the following transcript and format it into a concise medical note "
                    "in SOAP format. The note should include the patient's symptoms, any relevant history, and any medications or treatments "
                    "mentioned. Use dot points for clarity and ensure it is comprehensive yet concise.\n\n"
                    f"Transcript:\n{transcript}+{extra_notes}\n\n"
                    "Medical Note:\n\n"
                    "Subjective\n- \n\n"
                    "Objective\n- \n\n"
                    "Assessment\n- \n\n"
                    "Plan\n- "
                ),
            },
        ]

        # Call the OpenAI API to generate the medical note
        start_time_gpt = time.time()
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=500,
            temperature=0.1,
        )
        end_time_gpt = time.time()
        gpt_duration = end_time_gpt - start_time_gpt

        # Extract the generated medical note from the API response
        medical_note = response["choices"][0]["message"]["content"].strip()

        print(f"GPT model duration: {gpt_duration:.2f} seconds")
        print(f"Whisper model duration: {whisper_duration:.2f} seconds")

        return JsonResponse(
            {
                "transcript": transcript,
                "medical_note": medical_note,
                "extra_notes": extra_notes,
                "whisper_duration": whisper_duration,
                "gpt_duration": gpt_duration,
            }
        )

    return JsonResponse({"transcript": "", "medical_note": "", "extra_notes": ""})
