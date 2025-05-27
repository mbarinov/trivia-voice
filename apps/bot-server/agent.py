#!/usr/bin/env python3
"""
Voice AI Assistant using LiveKit Agents and Gemini Live API
"""

import logging
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions, RoomOutputOptions
from livekit.plugins import (
    google,
    noise_cancellation
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class Assistant(Agent):
    """Voice Assistant using Gemini Live API"""
    
    def __init__(self):
        super().__init__(
            instructions="""
            You are a helpful personal assistant. Respond in a natural, conversational 
            manner to the user's queries. Be concise but informative. If you don't 
            know something, admit it rather than making up information.
            """,
            llm=google.beta.realtime.RealtimeModel(
              model="gemini-2.0-flash-live-001",
              voice="Puck",
              temperature=0.7
            ),

        )

    async def on_enter(self):
        self.session.generate_reply(
            instructions="introduce yourself very briefly and ask about the user's day"
        )    

async def entrypoint(ctx: agents.JobContext):
    logger.info("Setting up Voice Assistant")
    
    await ctx.connect()

    session = AgentSession()
    
    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
        room_output_options=RoomOutputOptions(
            transcription_enabled=True,
        ),
    )

    logger.info(f"Connected to room")


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint)) 