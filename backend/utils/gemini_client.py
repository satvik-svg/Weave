import google.generativeai as genai
from config import get_settings
import json
import re

settings = get_settings()

# Configure Gemini API
genai.configure(api_key=settings.gemini_api_key)

# Initialize Gemini model - using the actual available model
model = genai.GenerativeModel('models/gemini-2.5-flash')


async def call_gemini(prompt: str, system_instruction: str = None) -> dict:
    """
    Call Gemini API with a prompt and return structured JSON response
    Falls back to rule-based analysis if Gemini fails
    """
    try:
        # Create the full prompt
        full_prompt = prompt
        if system_instruction:
            full_prompt = f"{system_instruction}\n\n{prompt}"
        
        # Generate response
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.95,
                top_k=40,
                max_output_tokens=2048,
            )
        )
        
        # Extract text and parse JSON
        text = response.text.strip()
        
        # Try to extract JSON from markdown code blocks
        # Match ```json...``` or ```...```
        json_pattern = r'```(?:json)?\s*([\s\S]*?)```'
        match = re.search(json_pattern, text)
        if match:
            text = match.group(1).strip()
        else:
            # No code block, try to find JSON object directly
            # Look for { ... } pattern
            json_obj_pattern = r'(\{[\s\S]*\})'
            match = re.search(json_obj_pattern, text)
            if match:
                text = match.group(1).strip()
        
        # Clean up common JSON issues
        # Remove trailing commas before } or ]
        text = re.sub(r',(\s*[}\]])', r'\1', text)
        
        # Parse JSON
        result = json.loads(text)
        return result
        
    except Exception as e:
        print(f"Gemini API failed, using fallback analysis: {e}")
        # Use rule-based fallback
        return await fallback_analysis(prompt)


async def fallback_analysis(prompt: str) -> dict:
    """
    Simple rule-based analysis when Gemini is unavailable
    Analyzes text using keywords and patterns
    """
    text = prompt.lower()
    
    # Determine category based on keywords
    category = "civic"
    if any(word in text for word in ["park", "garden", "clean", "trash", "environment", "graffiti", "paint"]):
        category = "environment"
    elif any(word in text for word in ["road", "pothole", "bridge", "infrastructure", "repair"]):
        category = "infrastructure"
    elif any(word in text for word in ["food", "homeless", "community", "families", "shelter"]):
        category = "social"
    elif any(word in text for word in ["crime", "safety", "danger", "security"]):
        category = "safety"
    
    # Determine urgency
    urgency = "medium"
    if any(word in text for word in ["urgent", "critical", "danger", "immediate", "emergency"]):
        urgency = "high"
    elif any(word in text for word in ["minor", "small", "eventually"]):
        urgency = "low"
    
    # Estimate scope
    scope = "medium"
    if any(word in text for word in ["large", "major", "extensive", "significant"]):
        scope = "large"
    elif any(word in text for word in ["small", "minor", "quick"]):
        scope = "small"
    
    # Priority calculation
    priority = 0.6
    if urgency == "high":
        priority = 0.85
    elif urgency == "low":
        priority = 0.4
    
    # Estimate volunteers
    volunteers = 5
    if scope == "large":
        volunteers = 10
    elif scope == "small":
        volunteers = 3
    
    # Generate tags
    tags = []
    if "clean" in text:
        tags.append("cleanup")
    if "paint" in text:
        tags.append("painting")
    if "garden" in text:
        tags.extend(["gardening", "maintenance"])
    if "volunteer" in text:
        tags.append("volunteer-friendly")
    
    return {
        "category": category,
        "priority": priority,
        "urgency": urgency,
        "estimated_scope": scope,
        "is_valid": True,
        "requires_resources": ["volunteers", "supplies"],
        "estimated_volunteers_needed": volunteers,
        "estimated_duration_days": 2 if scope == "small" else 5,
        "confidence": 0.75,
        "reasoning": f"Analyzed as {category} issue with {urgency} urgency based on keyword analysis. Fallback agent used.",
        "tags": tags if tags else ["community"]
    }
