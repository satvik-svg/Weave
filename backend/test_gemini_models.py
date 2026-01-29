"""
Quick script to list available Gemini models
Run this to see what models your API key can access
"""
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# Configure with your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("Available Gemini models that support generateContent:\n")

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"✅ {model.name}")
        print(f"   Display Name: {model.display_name}")
        print(f"   Description: {model.description[:100]}...")
        print()
