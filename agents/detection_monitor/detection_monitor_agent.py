"""Detection Monitor Agent for monitoring fire detections in the system."""

from typing import Any, Dict
import random


class DetectionMonitorAgent:
    """Agent that responds with random colors."""
    
    def __init__(self):
        self.name = "detection_monitor_agent"
        self.description = "A simple agent that responds with random colors when asked."
        self.instruction = """You are a friendly AI assistant that loves colors.
        When you receive a message:
        1. Get a random color
        2. Respond enthusiastically about the color
        3. Try to relate the color to something in nature or art
        """
    
    def get_random_color(self) -> str:
        """Get a random color from a predefined list.
        
        Returns:
            A randomly selected color string.
        """
        colors = ['red', 'blue', 'green']
        return random.choice(colors)
        
    async def run(self, message: str) -> Dict[str, Any]:
        """Main execution method for the agent.
        
        Args:
            message: The input message received by the agent.
            
        Returns:
            Dict containing the agent's response.
        """
        # Get a random color
        color = self.get_random_color()
        
        # Create an enthusiastic response
        responses = {
            'red': "I picked red! It's like a beautiful sunset or a field of poppies in bloom.",
            'blue': "I chose blue! It reminds me of the vast ocean on a clear summer day.",
            'green': "I selected green! It's like the fresh leaves in a spring forest."
        }
        
        return {
            "status": "success",
            "message": f"You said: '{message}'. {responses[color]}",
            "color": color
        }
