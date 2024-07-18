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
            content={
                "message": "Participant already has an entry on this station",
                "data": {"name": existing_entry[0][1]},
            },
        )

    result_one = result[0]

    result_entry = insert_one_entry(or_no=or_no, name=result_one[1], station=station)

    if not result_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create entry",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Dataset uploaded successfully",
            "data": {"rowId": result_entry, "name": result_one[1]},
        },
    )


from datetime import date, datetime, timezone, timedelta
import pytz


async def test_date():

    ph_time = timezone(timedelta(hours=8))

    current_time_ph = datetime.now(ph_time).strftime("%Y-%m-%d %H:%M:%S")
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "DATE NOW",
            "date": (str(date.today())),
            "datetime": str(datetime.now().strftime("%d/%m/%Y %H:%M:%S")),
            "ph_time": str(current_time_ph),
        },
    )

    # print("DATE")
    # print((str(date.today())))
