from tkinter import Entry
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from database import fetch_committee, fetch_entry, fetch_participant, insert_one_entry


class ORRequest(BaseModel):
    or_no: str


async def authenticate(request: ORRequest):
    or_no = request.or_no

    result = fetch_committee(or_no)

    print(result)

    if len(result) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to authenticate",
        )

    result_one = result[0]

    data = {
        "or_no": result_one[0],
        "name": result_one[1],
        "role": result_one[2],
        "station": result_one[3],
    }

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Dataset uploaded successfully", "data": data},
    )


class EntryRequest(BaseModel):
    or_no: str
    station: str


async def create_entry(request: EntryRequest):
    or_no = request.or_no
    station = request.station
    result = fetch_participant(or_no)

    if len(result) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found.",
        )
        
    # Avoid multiple entries in the same station
    existing_entry = fetch_entry(or_no=or_no, station=station)
    
    if len(existing_entry) > 1:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Participant already has an entry on this station", "data": existing_entry},
        )

    result_one = result[0]
    
    result_entry = insert_one_entry(
        or_no=or_no, name=result_one[1], station=station
    )
    
    if not result_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create entry",
        )
        
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Dataset uploaded successfully", "data": result_entry},
    )