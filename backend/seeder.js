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

        // Approximate coordinates for 800x600 visualization
        const coordinates = {
            // Blue Line (North to South)
            "Dakshineswar": { x: 350, y: 50 },
            "Baranagar": { x: 350, y: 80 },
            "Noapara": { x: 350, y: 110 },
            "Dum Dum": { x: 350, y: 140 },
            "Belgachhia": { x: 350, y: 170 },
            "Shyambazar": { x: 350, y: 200 },
            "Shobhabazar Sutanuti": { x: 350, y: 230 },
            "Girish Park": { x: 350, y: 260 },
            "Mahatma Gandhi Road": { x: 350, y: 290 },
            "Central": { x: 350, y: 320 },
            "Chandni Chowk": { x: 350, y: 350 },
            "Esplanade": { x: 400, y: 350 }, // Hub
            "Park Street": { x: 400, y: 380 },
            "Maidan": { x: 400, y: 410 },
            "Rabindra Sadan": { x: 400, y: 440 },
            "Netaji Bhavan": { x: 400, y: 470 },
            "Jatin Das Park": { x: 400, y: 500 },
            "Kalighat": { x: 400, y: 530 },
            "Rabindra Sarobar": { x: 400, y: 560 },
            "Mahanayak Uttam Kumar": { x: 400, y: 590 },
            "Netaji": { x: 400, y: 620 }, // Extend a bit
            "Masterda Surya Sen": { x: 400, y: 650 },
            "Gitanjali": { x: 400, y: 680 },
            "Kavi Nazrul": { x: 400, y: 710 },
            "Shahid Khudiram": { x: 400, y: 740 },
            "Kavi Subhash": { x: 400, y: 770 },

            // Green Line (East to West) - Intersects Esplanade
            "Howrah Maidan": { x: 100, y: 350 },
            "Howrah": { x: 160, y: 350 },
            "Mahakaran": { x: 220, y: 350 },
            // Esplanade is defined above
            "Sealdah": { x: 480, y: 350 },
            "Phoolbagan": { x: 540, y: 350 },
            "Salt Lake Stadium": { x: 580, y: 350 },
            "Bengal Chemical": { x: 620, y: 350 },
            "City Centre": { x: 660, y: 350 },
            "Central Park": { x: 700, y: 350 },
            "Karunamoyee": { x: 740, y: 350 },
            "Salt Lake Sector-V": { x: 780, y: 350 },

            // Purple Line (South West) connecting from Joka
            "Joka": { x: 100, y: 600 },
            "Thakurpukur": { x: 140, y: 570 },
            "Sakherbazar": { x: 180, y: 540 },
            "Behala Chowrasta": { x: 220, y: 510 },
            "Behala Bazar": { x: 260, y: 480 },
            "Taratala": { x: 300, y: 450 },
            "Majerhat": { x: 340, y: 420 }, // Close to main line?

            // Orange Line (South East) connecting Kavi Subhash
            // Kavi Subhash is defined
            "Satyajit Ray": { x: 450, y: 750 },
            "Jyotirindra Nandi": { x: 480, y: 720 },
            "Kavi Sukanta": { x: 510, y: 690 },
            "Hemanta Mukhopadhyay": { x: 540, y: 660 },
            "VIP Bazar": { x: 570, y: 630 },
            "Ritwik Ghatak": { x: 600, y: 600 },
            "Barun Sengupta": { x: 630, y: 570 },
            "Beliaghata": { x: 660, y: 540 }
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
