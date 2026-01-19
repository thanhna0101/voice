import { GoogleGenAI, Modality } from "@google/genai";
import { Gender } from "../types";
import { decodeBase64, pcmToWav } from "./audioUtils";

// Constants for Voices
const MALE_VOICE = 'Puck'; // Deep, clear male voice
const FEMALE_VOICE = 'Kore'; // Soft, clear female voice

export async function generateSpeechFromText(
  fullText: string,
  gender: Gender
): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  // Parse text: First line is instruction/accent, rest is content.
  const lines = fullText.split('\n');
  let textToSpeak = fullText;
  let styleInstruction = "";

  if (lines.length > 1) {
    styleInstruction = lines[0].trim();
    textToSpeak = lines.slice(1).join('\n').trim();
  } else {
    // Fallback if only one line provided
    textToSpeak = lines[0].trim();
  }

  if (!textToSpeak) {
    throw new Error("Please enter text content to convert.");
  }

  const voiceName = gender === Gender.MALE ? MALE_VOICE : FEMALE_VOICE;

  // Construct the prompt to guide the model's style
  const prompt = styleInstruction 
    ? `Please read the following text with this specific tone/accent: "${styleInstruction}". Text: "${textToSpeak}"`
    : textToSpeak;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from Gemini.");
    }

    // Convert Base64 -> Uint8Array (PCM) -> WAV Blob -> Object URL
    const pcmData = decodeBase64(base64Audio);
    // Gemini 2.5 Flash TTS typically outputs 24kHz
    const wavBlob = pcmToWav(pcmData, 24000); 
    
    return URL.createObjectURL(wavBlob);

  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    throw new Error(error.message || "Failed to generate speech.");
  }
}
