from __future__ import annotations

from enum import Enum
from typing import Optional, Union
from datetime import datetime

from pydantic import (
    AnyUrl,
    AwareDatetime,
    BaseModel,
    Field,
    RootModel,
    confloat,
    constr,
)


class Address(BaseModel):
    addressCountry: Optional[str] = Field(None, description="The country. For example, Spain")
    addressLocality: Optional[str] = Field(
        None,
        description="The locality in which the street address is, and which is in the region",
    )
    addressRegion: Optional[str] = Field(
        None,
        description="The region in which the locality is, and which is in the country",
    )
    district: Optional[str] = Field(
        None,
        description=(
            "A district is a type of administrative division that, in some countries, "
            "is managed by the local government"
        ),
    )
    postOfficeBoxNumber: Optional[str] = Field(
        None,
        description="The post office box number for PO box addresses. For example, 03578",
    )
    postalCode: Optional[str] = Field(None, description="The postal code. For example, 24004")
    streetAddress: Optional[str] = Field(None, description="The street address")
    streetNr: Optional[str] = Field(None, description="Number identifying a specific property on a public street")


class Type(Enum):
    Point = "Point"


class Location(BaseModel):
    bbox: Optional[list[float]] = Field(None, min_length=4)
    coordinates: list[float] = Field(..., min_length=2)
    type: Type


class Coordinate(RootModel[list[float]]):
    root: list[float]


class Type1(Enum):
    LineString = "LineString"


class Location1(BaseModel):
    bbox: Optional[list[float]] = Field(None, min_length=4)
    coordinates: list[Coordinate] = Field(..., min_length=2)
    type: Type1


class Type2(Enum):
    Polygon = "Polygon"


class Location2(BaseModel):
    bbox: Optional[list[float]] = Field(None, min_length=4)
    coordinates: list[list[Coordinate]]
    type: Type2


class Type3(Enum):
    MultiPoint = "MultiPoint"


class Location3(BaseModel):
    bbox: Optional[list[float]] = Field(None, min_length=4)
    coordinates: list[list[float]]
    type: Type3


class Type4(Enum):
    MultiLineString = "MultiLineString"


class Location4(BaseModel):
    bbox: Optional[list[float]] = Field(None, min_length=4)
    coordinates: list[list[Coordinate]]
    type: Type4


class Type5(Enum):
    MultiPolygon = "MultiPolygon"


class Location5(BaseModel):
    bbox: Optional[list[float]] = Field(None, min_length=4)
    coordinates: list[list[list[Coordinate]]]
    type: Type5


class Type6(Enum):
    AirQualityObserved = "AirQualityObserved"


class TypeofLocation(Enum):
    indoor = "indoor"
    outdoor = "outdoor"


class AirQualityObserved(BaseModel):
    address: Optional[Address] = Field(None, description="The mailing address")
    airQualityIndex: Optional[confloat(ge=0.0)] = Field(  # type: ignore[valid-type]
        None,
        description=("Air quality index is a number used to report the quality of the air on any given day"),
    )
    airQualityLevel: Optional[constr(min_length=2)] = Field(  # type: ignore[valid-type]
        None,
        description=("Overall qualitative level of health concern corresponding to the air quality observed"),
    )
    alternateName: Optional[str] = Field(None, description="An alternative name for this item")
    areaServed: Optional[str] = Field(
        None,
        description="Higher level area to which this air quality measurement belongs to",
    )
    as_: Optional[confloat(ge=0.0)] = Field(None, alias="as", description="Arsenic detected")  # type: ignore[valid-type]
    c6h6: Optional[confloat(ge=0.0)] = Field(None, description="Benzene detected")  # type: ignore[valid-type]
    cd: Optional[confloat(ge=0.0)] = Field(None, description="Cadmium detected")  # type: ignore[valid-type]
    co: Optional[confloat(ge=0.0)] = Field(None, description="Carbon Monoxide detected")  # type: ignore[valid-type]
    co2: Optional[confloat(ge=0.0)] = Field(None, description="Carbon Dioxide detected")  # type: ignore[valid-type]
    coLevel: Optional[str] = Field(None, description="Qualitative Carbon Monoxide presence")
    dataProvider: Optional[str] = Field(
        None,
        description="A sequence of characters identifying the provider of the harmonised data entity",
    )
    dateCreated: Optional[AwareDatetime] = Field(
        None,
        description="Entity creation timestamp. This will usually be allocated by the storage platform",
    )
    dateModified: Optional[AwareDatetime] = Field(
        None,
        description=(
            "Timestamp of the last modification of the entity. This will usually be allocated by the storage platform"
        ),
    )
    dateObserved: Optional[AwareDatetime] = Field(
        None, description="The date and time of this observation in ISO8601 UTCformat"
    )
    description: Optional[str] = Field(None, description="A description of this item")
    id: Optional[
        Union[
            constr(
                pattern=r"^[\\w\\-\\.\\{\\}\\$\\+\\*\\[\\]`|~^@!, :\\\\]+$",
                min_length=1,
                max_length=256,
            ),  # type: ignore[valid-type]
            AnyUrl,
        ]
    ] = Field(None, description="Unique identifier of the entity")
    location: Optional[Union[Location, Location1, Location2, Location3, Location4, Location5]] = Field(
        None,
        description=(
            "Geojson reference to the item. It can be Point, LineString, Polygon, "
            "MultiPoint, MultiLineString or MultiPolygon"
        ),
    )
    name: Optional[str] = Field(None, description="The name of this item")
    ni: Optional[confloat(ge=0.0)] = Field(None, description="Nickel detected ")  # type: ignore[valid-type]
    no: Optional[confloat(ge=0.0)] = Field(None, description="Nitrogen monoxide detected")  # type: ignore[valid-type]
    no2: Optional[confloat(ge=0.0)] = Field(None, description="Nitrogen dioxide detected")  # type: ignore[valid-type]
    nox: Optional[confloat(ge=0.0)] = Field(None, description="Other Nitrogen oxides detected")  # type: ignore[valid-type]
    o3: Optional[confloat(ge=0.0)] = Field(None, description="Ozone detected ")  # type: ignore[valid-type]
    owner: Optional[
        list[
            Union[
                constr(
                    pattern=r"^[\\w\\-\\.\\{\\}\\$\\+\\*\\[\\]`|~^@!,:\\\\]+$",
                    min_length=1,
                    max_length=256,
                ),  # type: ignore[valid-type]
                AnyUrl,
            ]
        ]
    ] = Field(
        None,
        description=(
            "A list containing a JSON encoded sequence of characters referencing the unique Ids of the owner(s)"
        ),
    )
    pb: Optional[confloat(ge=0.0)] = Field(None, description="Lead detected   ")  # type: ignore[valid-type]
    pm1: Optional[float] = Field(None, description="Particulate matter 1 micrometers or less in diameter")
    pm10: Optional[confloat(ge=0.0)] = Field(None, description="Particulate matter 10 micrometers or less in diameter")  # type: ignore[valid-type]
    pm25: Optional[confloat(ge=0.0)] = Field(None, description="Particulate matter 2.5 micrometers or less in diameter")  # type: ignore[valid-type]
    precipitation: Optional[confloat(ge=0.0)] = Field(None, description="Amount of water rain")  # type: ignore[valid-type]
    refDevice: Optional[
        Union[
            constr(
                pattern=r"^[\\w\\-\\.\\{\\}\\$\\+\\*\\[\\]`|~^@!, :\\\\]+$",
                min_length=1,
                max_length=256,
            ),  # type: ignore[valid-type]
            AnyUrl,
        ]
    ] = Field(None, description="A reference to the device(s) which captured this observation")
    refPointOfInterest: Optional[
        Union[
            constr(
                pattern=r"^[\\w\\-\\.\\{\\}\\$\\+\\*\\[\\]`|~^@!, :\\\\]+$",
                min_length=1,
                max_length=256,
            ),  # type: ignore[valid-type]
            AnyUrl,
        ]
    ] = Field(
        None,
        description=(
            "A reference to a point of interest (usually an air quality station) associated to this observation"
        ),
    )
    refWeatherObserved: Optional[
        Union[
            constr(
                pattern=r"^[\\w\\-\\.\\{\\}\\$\\+\\*\\[\\]`|~^@!, :\\\\]+$",
                min_length=1,
                max_length=256,
            ),  # type: ignore[valid-type]
            AnyUrl,
        ]
    ] = Field(
        None,
        description=("Weather observed associated to the air quality conditions described by this entity"),
    )
    relativeHumidity: Optional[confloat(ge=0.0, le=1.0)] = Field(  # type: ignore[valid-type]
        None,
        description=("Relative Humidity of the air (a number between 0 and 1 representing the range of 0% to 100%)"),
    )
    reliability: Optional[confloat(ge=0.0, le=1.0)] = Field(  # type: ignore[valid-type]
        None,
        description=("Reliability (percentage, expressed in parts per one) corresponding to the air quality observed"),
    )
    seeAlso: Optional[Union[list[AnyUrl], AnyUrl]] = Field(
        None, description="list of uri pointing to additional resources about the item"
    )
    sh2: Optional[confloat(ge=0.0)] = Field(None, description="Hydrogen sulfide detected")  # type: ignore[valid-type]
    so2: Optional[confloat(ge=0.0)] = Field(None, description="Sulfur dioxide detected")  # type: ignore[valid-type]
    source: Optional[str] = Field(
        None,
        description=(
            "A sequence of characters giving the original source of the entity data as a URL. "
            "Recommended to be the fully qualified domain name of the source provider, or the URL to the source object"
        ),
    )
    temperature: Optional[float] = Field(None, description="Temperature of the item")
    type: Optional[Type6] = Field(None, description="NGSI Entity type. It has to be AirQualityObserved")
    typeofLocation: Optional[TypeofLocation] = Field(None, description="Type of location of the sampled item")
    volatileOrganicCompoundsTotal: Optional[confloat(ge=0.0)] = Field(  # type: ignore[valid-type]
        None,
        description=(
            "Alkanes <C10, ketones <C6, aldehydes <C10, carboxylic acids <C5, aspirits<C7, Alkenes <C8, Aromatics"
        ),
    )
    windDirection: Optional[confloat(ge=-180.0, le=180.0)] = Field(None, description="Direction of the weather vane")  # type: ignore[valid-type]
    windSpeed: Optional[confloat(ge=0.0)] = Field(None, description="Intensity of the wind")  # type: ignore[valid-type]


class LocationInfo(BaseModel):
    """Simplified location information."""
    
    latitude: Optional[float] = Field(
        None,
        description="Latitude coordinate",
        example=21.0285
    )
    longitude: Optional[float] = Field(
        None,
        description="Longitude coordinate", 
        example=105.8542
    )
    address: Optional[str] = Field(
        None,
        description="Full address",
        example="Ho Chi Minh City, Vietnam"
    )
    area_served: Optional[str] = Field(
        None,
        description="Area where data is applicable",
        example="District 1"
    )


class ParticulateMatterData(BaseModel):
    """Particulate matter measurements."""
    
    pm1: Optional[float] = Field(
        None,
        description="PM1.0 concentration in μg/m³",
        example=8.5
    )
    pm25: Optional[float] = Field(
        None,
        description="PM2.5 concentration in μg/m³",
        example=25.3
    )
    pm10: Optional[float] = Field(
        None,
        description="PM10 concentration in μg/m³",
        example=45.7
    )


class GaseousPollutantsData(BaseModel):
    """Gaseous pollutants measurements."""
    
    co: Optional[float] = Field(
        None,
        description="Carbon Monoxide (CO) in mg/m³",
        example=0.8
    )
    co2: Optional[float] = Field(
        None,
        description="Carbon Dioxide (CO2) in mg/m³",
        example=450.0
    )
    no: Optional[float] = Field(
        None,
        description="Nitrogen Monoxide (NO) in μg/m³",
        example=15.2
    )
    no2: Optional[float] = Field(
        None,
        description="Nitrogen Dioxide (NO2) in μg/m³",
        example=35.6
    )
    nox: Optional[float] = Field(
        None,
        description="Nitrogen Oxides (NOx) in μg/m³",
        example=50.8
    )
    o3: Optional[float] = Field(
        None,
        description="Ozone (O3) in μg/m³",
        example=65.4
    )
    so2: Optional[float] = Field(
        None,
        description="Sulfur Dioxide (SO2) in μg/m³",
        example=12.3
    )
    sh2: Optional[float] = Field(
        None,
        description="Hydrogen Sulfide (H2S) in μg/m³",
        example=2.1
    )


class HeavyMetalsData(BaseModel):
    """Heavy metals and toxic compounds."""
    
    as_: Optional[float] = Field(
        None,
        alias="as",
        description="Arsenic (As) in μg/m³",
        example=0.005
    )
    cd: Optional[float] = Field(
        None,
        description="Cadmium (Cd) in μg/m³",
        example=0.002
    )
    ni: Optional[float] = Field(
        None,
        description="Nickel (Ni) in μg/m³",
        example=0.008
    )
    pb: Optional[float] = Field(
        None,
        description="Lead (Pb) in μg/m³",
        example=0.015
    )


class VolatileCompoundsData(BaseModel):
    """Volatile organic compounds."""
    
    c6h6: Optional[float] = Field(
        None,
        description="Benzene (C6H6) in μg/m³",
        example=3.2
    )
    voc_total: Optional[float] = Field(
        None,
        description="Total Volatile Organic Compounds in μg/m³",
        example=150.0
    )


class AirQualityIndexData(BaseModel):
    """Air Quality Index information."""
    
    aqi: Optional[float] = Field(
        None,
        description="Air Quality Index value",
        example=75.0
    )
    level: Optional[str] = Field(
        None,
        description="Air quality level description",
        example="Moderate"
    )
    co_level: Optional[str] = Field(
        None,
        description="Carbon monoxide level category",
        example="Good"
    )


class EnvironmentalConditions(BaseModel):
    """Environmental conditions related to air quality."""
    
    temperature: Optional[float] = Field(
        None,
        description="Temperature in Celsius",
        example=28.5
    )
    relative_humidity: Optional[float] = Field(
        None,
        description="Relative humidity (0-1)",
        example=0.70,
        ge=0.0,
        le=1.0
    )
    wind_speed: Optional[float] = Field(
        None,
        description="Wind speed in m/s",
        example=2.5
    )
    wind_direction: Optional[float] = Field(
        None,
        description="Wind direction in degrees (-180 to 180)",
        example=45.0,
        ge=-180.0,
        le=180.0
    )
    precipitation: Optional[float] = Field(
        None,
        description="Precipitation in mm",
        example=0.0
    )


class AirQualityObservedResponse(BaseModel):
    """API response schema for AirQualityObserved entity."""
    
    id: str = Field(
        ..., 
        description="Unique identifier of the AirQualityObserved entity",
        example="urn:ngsi-ld:AirQualityObserved:HCM-District1-001"
    )
    
    name: Optional[str] = Field(
        None,
        description="Name of the air quality monitoring station",
        example="District 1 Air Quality Station"
    )
    
    description: Optional[str] = Field(
        None,
        description="Description of the observation",
        example="Air quality monitoring in District 1, Ho Chi Minh City"
    )
    
    date_observed: Optional[datetime] = Field(
        None,
        description="Date and time when the observation was made",
        example="2025-12-04T10:30:00Z"
    )
    
    location: Optional[LocationInfo] = Field(
        None,
        description="Location information"
    )
    
    air_quality_index: Optional[AirQualityIndexData] = Field(
        None,
        description="Air Quality Index data"
    )
    
    particulate_matter: Optional[ParticulateMatterData] = Field(
        None,
        description="Particulate matter concentrations"
    )
    
    gaseous_pollutants: Optional[GaseousPollutantsData] = Field(
        None,
        description="Gaseous pollutants measurements"
    )
    
    heavy_metals: Optional[HeavyMetalsData] = Field(
        None,
        description="Heavy metals concentrations"
    )
    
    volatile_compounds: Optional[VolatileCompoundsData] = Field(
        None,
        description="Volatile organic compounds"
    )
    
    environmental: Optional[EnvironmentalConditions] = Field(
        None,
        description="Related environmental conditions"
    )
    
    type_of_location: Optional[str] = Field(
        None,
        description="Type of location (indoor/outdoor)",
        example="outdoor"
    )
    
    reliability: Optional[float] = Field(
        None,
        description="Data reliability (0-1)",
        example=0.95,
        ge=0.0,
        le=1.0
    )
    
    metadata: Optional[dict] = Field(
        None,
        description="Additional metadata",
        example={
            "data_provider": "OpenAQ",
            "source": "https://openaq.org",
            "ref_device": "urn:ngsi-ld:Device:AirQuality-Sensor-001",
            "ref_point_of_interest": "urn:ngsi-ld:PointOfInterest:District1-Center"
        }
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "urn:ngsi-ld:AirQualityObserved:HCM-District1-001",
                "name": "District 1 Air Quality Station",
                "description": "Air quality monitoring in District 1, Ho Chi Minh City",
                "date_observed": "2025-12-04T10:30:00Z",
                "location": {
                    "latitude": 10.7769,
                    "longitude": 106.7009,
                    "address": "District 1, Ho Chi Minh City, Vietnam",
                    "area_served": "District 1"
                },
                "air_quality_index": {
                    "aqi": 75.0,
                    "level": "Moderate",
                    "co_level": "Good"
                },
                "particulate_matter": {
                    "pm1": 8.5,
                    "pm25": 25.3,
                    "pm10": 45.7
                },
                "gaseous_pollutants": {
                    "co": 0.8,
                    "co2": 450.0,
                    "no2": 35.6,
                    "o3": 65.4,
                    "so2": 12.3
                },
                "environmental": {
                    "temperature": 28.5,
                    "relative_humidity": 0.70,
                    "wind_speed": 2.5,
                    "wind_direction": 45.0
                },
                "type_of_location": "outdoor",
                "reliability": 0.95
            }
        }


class AirQualityListResponse(BaseModel):
    """Response for list of air quality observations."""
    
    total: int = Field(
        ...,
        description="Total number of air quality observations",
        example=10
    )
    
    items: list[AirQualityObservedResponse] = Field(
        ...,
        description="List of air quality observations"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 2,
                "items": [
                    {
                        "id": "urn:ngsi-ld:AirQualityObserved:HCM-District1-001",
                        "name": "District 1 Air Quality Station",
                        "date_observed": "2025-12-04T10:30:00Z",
                        "air_quality_index": {
                            "aqi": 75.0,
                            "level": "Moderate"
                        },
                        "particulate_matter": {
                            "pm25": 25.3
                        }
                    }
                ]
            }
        }
