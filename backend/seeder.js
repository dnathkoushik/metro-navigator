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

        const stationMap = {};

        linesData.forEach(lineCtx => {
            lineCtx.stations.forEach((stationName, index) => {
                if (!stationMap[stationName]) {
                    stationMap[stationName] = {
                        name: stationName,
                        lines: [],
                        isInterchange: false
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
