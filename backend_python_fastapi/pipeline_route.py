from fastapi import APIRouter, File, UploadFile, HTTPException
import shutil
import os

pipeline_router = APIRouter()

# Optional: define allowed types for images and PDFs
ALLOWED_EXTENSIONS = {"image/jpeg", "image/png", "application/pdf"}

@pipeline_router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # 1. Validate File Type
    if file.content_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and PDF are allowed.")

    # 2. Save the file locally
    file_location = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"info": f"file '{file.filename}' saved at '{file_location}'", "content_type": file.content_type}
