"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from functools import lru_cache

import requests


@lru_cache(maxsize=128)
def get_street_name(lat: float, lon: float) -> str:
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
    try:
        resp = requests.get(url, headers={"User-Agent": "Open-Terra/1.0"}, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            address = data.get("address", {})
            return address.get("road") or data.get("display_name") or "Unknown location"
    except Exception:
        pass
    return "Unknown location"
