"""Script to deploy the Detection Monitor Agent."""

from fastapi import FastAPI
from pydantic import BaseModel
from detection_monitor_agent import DetectionMonitorAgent
import uvicorn

app = FastAPI()
agent = DetectionMonitorAgent()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    """Endpoint to chat with the agent."""
    response = await agent.run(message=request.message)
    return response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
