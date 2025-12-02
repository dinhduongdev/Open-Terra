require('dotenv').config();

module.exports = {
	mqtt: {
		brokerUrl: process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
		options: {
			clientId: `iot-devices-${Math.random().toString(16).slice(2, 10)}`,
			clean: true,
			reconnectPeriod: 1000,
		},
	},

	ultralight: {
		apiKey: process.env.API_KEY || "4jggokgpepnvsb2uv4s40d59ov",
		protocol: "ul",
	},

	fiware: {
		service: process.env.FIWARE_SERVICE || "openiot",
		servicePath: process.env.FIWARE_SERVICEPATH || "/",
	},

	// Multiple devices can be configured with different locations
	// Each device represents a sensor at a specific location in the city
	devices: {
		// Traffic monitoring devices at different roads
		trafficDevices: [
			{
				deviceId: process.env.TRAFFIC_DEVICE_ID_1 || "traffic001",
				entityName:
					process.env.TRAFFIC_ENTITY_NAME_1 ||
					"urn:ngsi-ld:TrafficFlowObserved:001",
				entityType: "TrafficFlowObserved",
				interval: parseInt(process.env.TRAFFIC_INTERVAL) || 30000,
				laneId: 1,
				location: {
					lat: 10.825267, // Truong Chinh Street, Tan Phu, HCMC
					lon: 106.627338,
				},
				attributes: {
					intensity: "i", // Total vehicle count
					averageVehicleSpeed: "s", // Average speed (km/h)
					congested: "c", // Congestion flag (boolean)
					occupancy: "o", // Lane occupancy (0-1)
					laneId: "l", // Lane number
					dateObserved: "d", // Observation timestamp
					location: "loc", // GPS coordinates
				},
			},
			{
				deviceId: process.env.TRAFFIC_DEVICE_ID_2 || "traffic002",
				entityName:
					process.env.TRAFFIC_ENTITY_NAME_2 ||
					"urn:ngsi-ld:TrafficFlowObserved:002",
				entityType: "TrafficFlowObserved",
				interval: parseInt(process.env.TRAFFIC_INTERVAL) || 30000,
				laneId: 2,
				location: {
					lat: 10.80367, // Xo Viet Nghe Tinh Street, Binh Thanh, HCMC
					lon: 106.711432,
				},
				attributes: {
					intensity: "i",
					averageVehicleSpeed: "s",
					congested: "c",
					occupancy: "o",
					laneId: "l",
					dateObserved: "d",
					location: "loc",
				},
			},
			{
				deviceId: process.env.TRAFFIC_DEVICE_ID_3 || "traffic003",
				entityName:
					process.env.TRAFFIC_ENTITY_NAME_3 ||
					"urn:ngsi-ld:TrafficFlowObserved:003",
				entityType: "TrafficFlowObserved",
				interval: parseInt(process.env.TRAFFIC_INTERVAL) || 30000,
				laneId: 1,
				location: {
					lat: 10.800691, // Cong Hoa Street, Tan Binh, HCMC
					lon: 106.661781,
				},
				attributes: {
					intensity: "i",
					averageVehicleSpeed: "s",
					congested: "c",
					occupancy: "o",
					laneId: "l",
					dateObserved: "d",
					location: "loc",
				},
			},
		],

		// Water level monitoring devices at drain locations
		waterDevices: [
			{
				deviceId: process.env.WATER_DEVICE_ID_1 || "water001",
				entityName:
					process.env.WATER_ENTITY_NAME_1 || "urn:ngsi-ld:WaterObserved:001",
				entityType: "WaterObserved",
				interval: parseInt(process.env.WATER_INTERVAL) || 30000,
				location: {
					lat: 10.842639, // Nguyen Van Khoi, Go Vap, HCMC (flood-prone)
					lon: 106.6543,
				},
				drainageCapacity: 0.35, // meters
				attributes: {
					waterLevel: "w", // Water level (meters)
					flow: "f", // Water flow (m³/s)
					height: "h", // Water height (meters)
					dateObserved: "d", // Observation timestamp
					floodStatus: "fs", // Flood status (normal/warning/alert/danger)
					location: "loc", // GPS coordinates
					tidalSurge: "ts", // Tidal surge active (boolean)
					lunarDay: "ld", // Lunar calendar day
				},
			},
			{
				deviceId: process.env.WATER_DEVICE_ID_2 || "water002",
				entityName:
					process.env.WATER_ENTITY_NAME_2 || "urn:ngsi-ld:WaterObserved:002",
				entityType: "WaterObserved",
				interval: parseInt(process.env.WATER_INTERVAL) || 30000,
				location: {
					lat: 10.751735, // Tran Xuan Soan, District 7, HCMC (near canal)
					lon: 106.70371,
				},
				drainageCapacity: 0.4, // meters
				attributes: {
					waterLevel: "w",
					flow: "f",
					height: "h",
					dateObserved: "d",
					floodStatus: "fs",
					location: "loc",
					tidalSurge: "ts",
					lunarDay: "ld",
				},
			},
			{
				deviceId: process.env.WATER_DEVICE_ID_3 || "water003",
				entityName:
					process.env.WATER_ENTITY_NAME_3 || "urn:ngsi-ld:WaterObserved:003",
				entityType: "WaterObserved",
				interval: parseInt(process.env.WATER_INTERVAL) || 30000,
				location: {
					lat: 10.85345, // Pham Van Chieu, Go Vap, HCMC
					lon: 106.663544,
				},
				drainageCapacity: 0.3, // meters (smaller capacity)
				attributes: {
					waterLevel: "w",
					flow: "f",
					height: "h",
					dateObserved: "d",
					floodStatus: "fs",
					location: "loc",
					tidalSurge: "ts",
					lunarDay: "ld",
				},
			},
		],
	},
};
