#!/bin/bash

IOTA_URL="http://localhost:4041"
FIWARE_SERVICE="openiot"
FIWARE_SERVICEPATH="/"
API_KEY="4jggokgpepnvsb2uv4s40d59ov"

echo "=== 1. Checking current devices ==="
curl -X GET "${IOTA_URL}/iot/devices" \
  -H "fiware-service: ${FIWARE_SERVICE}" \
  -H "fiware-servicepath: ${FIWARE_SERVICEPATH}"

echo -e "\n\n=== 2. Deleting all devices ==="
for device_id in traffic001 traffic002 traffic003 flood001 flood002 flood003; do
  echo "Deleting ${device_id}..."
  curl -X DELETE "${IOTA_URL}/iot/devices/${device_id}" \
    -H "fiware-service: ${FIWARE_SERVICE}" \
    -H "fiware-servicepath: ${FIWARE_SERVICEPATH}"
  echo ""
done

echo -e "\n=== 3. Verifying devices deleted ==="
curl -X GET "${IOTA_URL}/iot/devices" \
  -H "fiware-service: ${FIWARE_SERVICE}" \
  -H "fiware-servicepath: ${FIWARE_SERVICEPATH}"

echo -e "\n\n=== 4. Checking service groups ==="
curl -X GET "${IOTA_URL}/iot/services" \
  -H "fiware-service: ${FIWARE_SERVICE}" \
  -H "fiware-servicepath: ${FIWARE_SERVICEPATH}"

echo -e "\n\n=== 5. Deleting service group ==="
curl -X DELETE "${IOTA_URL}/iot/services?resource=&apikey=${API_KEY}" \
  -H "fiware-service: ${FIWARE_SERVICE}" \
  -H "fiware-servicepath: ${FIWARE_SERVICEPATH}"

echo -e "\n\n=== 6. Verifying service group deleted ==="
curl -X GET "${IOTA_URL}/iot/services" \
  -H "fiware-service: ${FIWARE_SERVICE}" \
  -H "fiware-servicepath: ${FIWARE_SERVICEPATH}"
