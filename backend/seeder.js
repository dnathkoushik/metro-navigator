const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Station = require('./models/Station');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Station.deleteMany();

        const linesData = [
            {
                name: "Blue Line",
                stations: [
                    "Dakshineswar", "Baranagar", "Noapara", "Dum Dum", "Belgachhia",
                    "Shyambazar", "Shobhabazar Sutanuti", "Girish Park", "Mahatma Gandhi Road",
                    "Central", "Chandni Chowk", "Esplanade", "Park Street", "Maidan",
                    "Rabindra Sadan", "Netaji Bhavan", "Jatin Das Park", "Kalighat",
                    "Rabindra Sarobar", "Mahanayak Uttam Kumar", "Netaji", "Masterda Surya Sen",
                    "Gitanjali", "Kavi Nazrul", "Shahid Khudiram", "Kavi Subhash"
                ]
            },
            {
                name: "Green Line",
                stations: [
                    "Howrah Maidan", "Howrah", "Mahakaran", "Esplanade", "Sealdah",
                    "Phoolbagan", "Salt Lake Stadium", "Bengal Chemical", "City Centre",
                    "Central Park", "Karunamoyee", "Salt Lake Sector-V"
                ]
            },
            {
                name: "Purple Line",
                stations: [
                    "Joka", "Thakurpukur", "Sakherbazar", "Behala Chowrasta",
                    "Behala Bazar", "Taratala", "Majerhat"
                ]
            },
            {
                name: "Orange Line",
                stations: [
                    "Kavi Subhash", "Satyajit Ray", "Jyotirindra Nandi", "Kavi Sukanta",
                    "Hemanta Mukhopadhyay", "VIP Bazar", "Ritwik Ghatak", "Barun Sengupta",
                    "Beliaghata"
                ]
            }
        ];

        // Coordinates for 1200x1500 visualization
        // Center X ~ 600, Center Y ~ 600 (Esplanade)
        const C_X = 600;
        const C_Y = 600;
        const Y_SPACING = 50;
        const X_SPACING = 60;

        const coordinates = {
            // Blue Line (North - South)
            // Starts top center
            "Dakshineswar": { x: C_X, y: 50 },
            "Baranagar": { x: C_X, y: 100 },
            "Noapara": { x: C_X, y: 150 },
            "Dum Dum": { x: C_X, y: 200 },
            "Belgachhia": { x: C_X, y: 250 },
            "Shyambazar": { x: C_X, y: 300 },
            "Shobhabazar Sutanuti": { x: C_X, y: 350 },
            "Girish Park": { x: C_X, y: 400 },
            "Mahatma Gandhi Road": { x: C_X, y: 450 },
            "Central": { x: C_X, y: 500 },
            "Chandni Chowk": { x: C_X, y: 550 },
            "Esplanade": { x: C_X, y: C_Y }, // 600
            "Park Street": { x: C_X, y: 650 },
            "Maidan": { x: C_X, y: 700 },
            "Rabindra Sadan": { x: C_X, y: 750 },
            "Netaji Bhavan": { x: C_X, y: 800 },
            "Jatin Das Park": { x: C_X, y: 850 },
            "Kalighat": { x: C_X, y: 900 },
            "Rabindra Sarobar": { x: C_X, y: 950 },
            "Mahanayak Uttam Kumar": { x: C_X, y: 1000 },
            "Netaji": { x: C_X, y: 1050 },
            "Masterda Surya Sen": { x: C_X, y: 1100 },
            "Gitanjali": { x: C_X, y: 1150 },
            "Kavi Nazrul": { x: C_X, y: 1200 },
            "Shahid Khudiram": { x: C_X, y: 1250 },
            "Kavi Subhash": { x: C_X, y: 1300 },

            // Green Line (East - West)
            // Intersects Esplanade (600, 600)
            "Howrah Maidan": { x: C_X - (3 * X_SPACING + 40), y: C_Y }, // 380, 600
            "Howrah": { x: C_X - (2 * X_SPACING + 20), y: C_Y }, // 460
            "Mahakaran": { x: C_X - X_SPACING, y: C_Y }, // 540
            // Esplanade
            "Sealdah": { x: C_X + 100, y: C_Y }, // 700
            "Phoolbagan": { x: C_X + 160, y: C_Y },
            "Salt Lake Stadium": { x: C_X + 220, y: C_Y },
            "Bengal Chemical": { x: C_X + 280, y: C_Y },
            "City Centre": { x: C_X + 340, y: C_Y },
            "Central Park": { x: C_X + 400, y: C_Y },
            "Karunamoyee": { x: C_X + 460, y: C_Y },
            "Salt Lake Sector-V": { x: C_X + 520, y: C_Y },

            // Purple Line (Joka to Majerhat)
            // South West Area. 
            // Needs to be distinct. 
            "Joka": { x: 200, y: 1100 },
            "Thakurpukur": { x: 200, y: 1050 },
            "Sakherbazar": { x: 200, y: 1000 },
            "Behala Chowrasta": { x: 200, y: 950 },
            "Behala Bazar": { x: 200, y: 900 },
            "Taratala": { x: 200, y: 850 },
            "Majerhat": { x: 280, y: 800 },

            // Orange Line (Connecting Kavi Subhash and going North/East)
            // Kavi Subhash is at (600, 1300)
            "Satyajit Ray": { x: 700, y: 1250 },
            "Jyotirindra Nandi": { x: 750, y: 1200 },
            "Kavi Sukanta": { x: 800, y: 1150 },
            "Hemanta Mukhopadhyay": { x: 850, y: 1100 },
            "VIP Bazar": { x: 900, y: 1050 },
            "Ritwik Ghatak": { x: 950, y: 1000 },
            "Barun Sengupta": { x: 1000, y: 950 },
            "Beliaghata": { x: 1050, y: 900 }
        };

        const stationMap = {};

        linesData.forEach(lineCtx => {
            lineCtx.stations.forEach((stationName, index) => {
                if (!stationMap[stationName]) {
                    const coords = coordinates[stationName] || { x: 100, y: 100 }; // Default fallback
                    stationMap[stationName] = {
                        name: stationName,
                        lines: [],
                        isInterchange: false,
                        x: coords.x,
                        y: coords.y
                    };
                }

                stationMap[stationName].lines.push({
                    line: lineCtx.name,
                    sequence: index + 1
                });

                if (stationMap[stationName].lines.length > 1) {
                    stationMap[stationName].isInterchange = true;
                }
            });
        });

        const stationsToInsert = Object.values(stationMap);

        await Station.insertMany(stationsToInsert);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Station.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
