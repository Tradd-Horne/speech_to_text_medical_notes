# Consultation-to-Notes-Base-Model

## Project Description

**Consultation-to-Notes-Base-Model** is a powerful tool designed to streamline the documentation process in clinical environments. This application allows healthcare practitioners to record or upload audio from consultations, which is then automatically converted into detailed medical progress notes. This assists practitioners in efficiently documenting patient interactions, enhancing accuracy, and saving time.

## Installation Instructions

To set up the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/Consultation-to-Notes-Base-Model.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Consultation-to-Notes-Base-Model
    ```

3. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file in the project root directory and add your `OPENAI_API_KEY`:

    ```bash
    touch .env
    ```

    Then add the following line to the `.env` file:

    ```env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

## Usage Instructions

This project is intended for use in clinical environments where accurate and efficient documentation is crucial. To use the application:

1. Record or upload the audio of a clinical session.
2. The audio will be processed and converted into medical progress notes.
3. Review and edit the notes as needed to guide the final medical documentation.

This tool enhances the workflow for healthcare professionals, ensuring that critical details are captured and documented efficiently.

## Technologies Used

- **Django**: The web framework that serves as the backbone of the project.
- **Whisper**: A cutting-edge speech-to-text translation technology.
- **OpenAI GPT Model**: Powers the natural language processing to create coherent and detailed medical notes.

## Features

- **Audio Recording & Upload**: Capture consultation audio directly or upload existing recordings.
- **Speech-to-Text Conversion**: Automatically transcribe spoken words into text using Whisper.
- **Progress Notes Generation**: Leverage the OpenAI GPT model to transform transcripts into detailed medical progress notes.

## Contributors

- **Tradd Horne**
  - Location: Brisbane, Australia

## License

This project is licensed under the MIT License, making it free to use and modify. For more details, see the [LICENSE](./LICENSE) file.
