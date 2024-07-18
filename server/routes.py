from fastapi import APIRouter

from controllers import authenticate, create_entry, test_date

router = APIRouter()

router.add_api_route("/authenticate", methods=["POST"], endpoint=authenticate)

router.add_api_route("/add-entry", methods=["POST"], endpoint=create_entry)

router.add_api_route("/test-date", methods=['GET'], endpoint=test_date)