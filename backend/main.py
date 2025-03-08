from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for all origins (for demo purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

counter = 0

@app.get("/api/click")
async def click():
    global counter
    counter += 1
    return {"message": "Button clicked", "count": counter}
