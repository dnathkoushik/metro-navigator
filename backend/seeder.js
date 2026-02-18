const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Station = require('./models/Station');
const City = require('./models/City');

dotenv.config();

connectDB();

const citiesData = [
    {
        name: 'Kolkata',
        slug: 'kolkata',
        state: 'West Bengal',
        description: 'India\'s oldest metro system, inaugurated in 1984.',
        lines: [
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
        ],
        coordinates: {
            "Dakshineswar": { x: 600, y: 50 },
            "Baranagar": { x: 600, y: 100 },
            "Noapara": { x: 600, y: 150 },
            "Dum Dum": { x: 600, y: 200 },
            "Belgachhia": { x: 600, y: 250 },
            "Shyambazar": { x: 600, y: 300 },
            "Shobhabazar Sutanuti": { x: 600, y: 350 },
            "Girish Park": { x: 600, y: 400 },
            "Mahatma Gandhi Road": { x: 600, y: 450 },
            "Central": { x: 600, y: 500 },
            "Chandni Chowk": { x: 600, y: 550 },
            "Esplanade": { x: 600, y: 600 },
            "Park Street": { x: 600, y: 650 },
            "Maidan": { x: 600, y: 700 },
            "Rabindra Sadan": { x: 600, y: 750 },
            "Netaji Bhavan": { x: 600, y: 800 },
            "Jatin Das Park": { x: 600, y: 850 },
            "Kalighat": { x: 600, y: 900 },
            "Rabindra Sarobar": { x: 600, y: 950 },
            "Mahanayak Uttam Kumar": { x: 600, y: 1000 },
            "Netaji": { x: 600, y: 1050 },
            "Masterda Surya Sen": { x: 600, y: 1100 },
            "Gitanjali": { x: 600, y: 1150 },
            "Kavi Nazrul": { x: 600, y: 1200 },
            "Shahid Khudiram": { x: 600, y: 1250 },
            "Kavi Subhash": { x: 600, y: 1300 },
            "Howrah Maidan": { x: 380, y: 600 },
            "Howrah": { x: 460, y: 600 },
            "Mahakaran": { x: 540, y: 600 },
            "Sealdah": { x: 700, y: 600 },
            "Phoolbagan": { x: 760, y: 600 },
            "Salt Lake Stadium": { x: 820, y: 600 },
            "Bengal Chemical": { x: 880, y: 600 },
            "City Centre": { x: 940, y: 600 },
            "Central Park": { x: 1000, y: 600 },
            "Karunamoyee": { x: 1060, y: 600 },
            "Salt Lake Sector-V": { x: 1120, y: 600 },
            "Joka": { x: 200, y: 1100 },
            "Thakurpukur": { x: 200, y: 1050 },
            "Sakherbazar": { x: 200, y: 1000 },
            "Behala Chowrasta": { x: 200, y: 950 },
            "Behala Bazar": { x: 200, y: 900 },
            "Taratala": { x: 200, y: 850 },
            "Majerhat": { x: 280, y: 800 },
            "Satyajit Ray": { x: 700, y: 1250 },
            "Jyotirindra Nandi": { x: 750, y: 1200 },
            "Kavi Sukanta": { x: 800, y: 1150 },
            "Hemanta Mukhopadhyay": { x: 850, y: 1100 },
            "VIP Bazar": { x: 900, y: 1050 },
            "Ritwik Ghatak": { x: 950, y: 1000 },
            "Barun Sengupta": { x: 1000, y: 950 },
            "Beliaghata": { x: 1050, y: 900 }
        }
    },
    {
        name: 'Delhi',
        slug: 'delhi',
        state: 'Delhi',
        description: 'One of the largest metro networks in the world with 12 lines.',
        lines: [
            {
                name: "Red Line",
                stations: [
                    "Shahabad Mohammadpur", "Dwarka Sector 21", "Dwarka Sector 8",
                    "Dwarka Sector 9", "Dwarka Sector 10", "Dwarka Sector 11",
                    "Dwarka Sector 12", "Dwarka Sector 13", "Dwarka Sector 14",
                    "Dwarka", "Dwarka Mor", "Nawada", "Uttam Nagar West",
                    "Uttam Nagar East", "Janakpuri West", "Janakpuri East",
                    "Tilak Nagar", "Subhash Nagar", "Tagore Garden", "Rajouri Garden",
                    "Ramesh Nagar", "Moti Nagar", "Kirti Nagar", "Shadipur",
                    "Patel Nagar", "Rajendra Place", "Karol Bagh", "Jhandewalan",
                    "Ramakrishna Ashram Marg", "Rajiv Chowk", "Barakhamba Road",
                    "Mandi House", "Pragati Maidan", "Indraprastha"
                ]
            },
            {
                name: "Yellow Line",
                stations: [
                    "Samaypur Badli", "Rohini Sector 18-19", "Haiderpur Badli Mor",
                    "Jahangirpuri", "Adarsh Nagar", "Azadpur", "Model Town",
                    "GTB Nagar", "Vishwavidyalaya", "Vidhan Sabha", "Civil Lines",
                    "Kashmere Gate", "Chandni Chowk", "Chawri Bazar", "New Delhi",
                    "Rajiv Chowk", "Patel Chowk", "Central Secretariat",
                    "Udyog Bhawan", "Lok Kalyan Marg", "Jor Bagh", "INA",
                    "AIIMS", "Green Park", "Hauz Khas", "Malviya Nagar",
                    "Saket", "Qutab Minar", "Chhattarpur", "Sultanpur",
                    "Ghitorni", "Arjan Garh", "Guru Dronacharya", "Sikanderpur",
                    "MG Road", "IFFCO Chowk", "HUDA City Centre"
                ]
            },
            {
                name: "Blue Line",
                stations: [
                    "Dwarka Sector 21", "Noida City Centre", "Botanical Garden",
                    "Sector 18", "Sector 16", "Sector 15", "New Ashok Nagar",
                    "Mayur Vihar Phase-1", "Akshardham", "Yamuna Bank",
                    "Indraprastha", "Pragati Maidan", "Mandi House", "Barakhamba Road",
                    "Rajiv Chowk", "RK Ashram Marg", "Karol Bagh", "Rajendra Place",
                    "Patel Nagar", "Shadipur", "Kirti Nagar", "Moti Nagar",
                    "Ramesh Nagar", "Rajouri Garden", "Tagore Garden", "Subhash Nagar",
                    "Tilak Nagar", "Janakpuri East", "Janakpuri West", "Uttam Nagar East",
                    "Uttam Nagar West", "Nawada", "Dwarka Mor", "Dwarka"
                ]
            }
        ],
        coordinates: {
            // Yellow Line - North-South spine
            "Samaypur Badli": { x: 600, y: 50 },
            "Rohini Sector 18-19": { x: 600, y: 90 },
            "Haiderpur Badli Mor": { x: 600, y: 130 },
            "Jahangirpuri": { x: 600, y: 170 },
            "Adarsh Nagar": { x: 600, y: 210 },
            "Azadpur": { x: 600, y: 250 },
            "Model Town": { x: 600, y: 290 },
            "GTB Nagar": { x: 600, y: 330 },
            "Vishwavidyalaya": { x: 600, y: 370 },
            "Vidhan Sabha": { x: 600, y: 410 },
            "Civil Lines": { x: 600, y: 450 },
            "Kashmere Gate": { x: 600, y: 490 },
            "Chandni Chowk": { x: 600, y: 530 },
            "Chawri Bazar": { x: 600, y: 570 },
            "New Delhi": { x: 600, y: 610 },
            "Rajiv Chowk": { x: 600, y: 650 },
            "Patel Chowk": { x: 600, y: 690 },
            "Central Secretariat": { x: 600, y: 730 },
            "Udyog Bhawan": { x: 600, y: 770 },
            "Lok Kalyan Marg": { x: 600, y: 810 },
            "Jor Bagh": { x: 600, y: 850 },
            "INA": { x: 600, y: 890 },
            "AIIMS": { x: 600, y: 930 },
            "Green Park": { x: 600, y: 970 },
            "Hauz Khas": { x: 600, y: 1010 },
            "Malviya Nagar": { x: 600, y: 1050 },
            "Saket": { x: 600, y: 1090 },
            "Qutab Minar": { x: 600, y: 1130 },
            "Chhattarpur": { x: 600, y: 1170 },
            "Sultanpur": { x: 600, y: 1210 },
            "Ghitorni": { x: 600, y: 1250 },
            "Arjan Garh": { x: 600, y: 1290 },
            "Guru Dronacharya": { x: 600, y: 1330 },
            "Sikanderpur": { x: 600, y: 1370 },
            "MG Road": { x: 600, y: 1410 },
            "IFFCO Chowk": { x: 600, y: 1450 },
            "HUDA City Centre": { x: 600, y: 1490 },
            // Red/Blue Line - East-West
            "Shahabad Mohammadpur": { x: 50, y: 800 },
            "Dwarka Sector 21": { x: 100, y: 800 },
            "Dwarka Sector 8": { x: 150, y: 750 },
            "Dwarka Sector 9": { x: 180, y: 720 },
            "Dwarka Sector 10": { x: 210, y: 690 },
            "Dwarka Sector 11": { x: 240, y: 660 },
            "Dwarka Sector 12": { x: 270, y: 630 },
            "Dwarka Sector 13": { x: 300, y: 600 },
            "Dwarka Sector 14": { x: 330, y: 570 },
            "Dwarka": { x: 150, y: 850 },
            "Dwarka Mor": { x: 200, y: 850 },
            "Nawada": { x: 250, y: 850 },
            "Uttam Nagar West": { x: 300, y: 850 },
            "Uttam Nagar East": { x: 350, y: 850 },
            "Janakpuri West": { x: 400, y: 850 },
            "Janakpuri East": { x: 450, y: 850 },
            "Tilak Nagar": { x: 500, y: 850 },
            "Subhash Nagar": { x: 540, y: 850 },
            "Tagore Garden": { x: 580, y: 850 },
            "Rajouri Garden": { x: 620, y: 850 },
            "Ramesh Nagar": { x: 660, y: 850 },
            "Moti Nagar": { x: 700, y: 850 },
            "Kirti Nagar": { x: 740, y: 850 },
            "Shadipur": { x: 780, y: 850 },
            "Patel Nagar": { x: 820, y: 850 },
            "Rajendra Place": { x: 860, y: 850 },
            "Karol Bagh": { x: 900, y: 850 },
            "Jhandewalan": { x: 940, y: 850 },
            "Ramakrishna Ashram Marg": { x: 980, y: 800 },
            "RK Ashram Marg": { x: 980, y: 800 },
            "Barakhamba Road": { x: 1020, y: 750 },
            "Mandi House": { x: 1060, y: 700 },
            "Pragati Maidan": { x: 1100, y: 650 },
            "Indraprastha": { x: 1140, y: 600 },
            // Blue Line East
            "Noida City Centre": { x: 1400, y: 600 },
            "Botanical Garden": { x: 1350, y: 620 },
            "Sector 18": { x: 1300, y: 640 },
            "Sector 16": { x: 1260, y: 640 },
            "Sector 15": { x: 1220, y: 640 },
            "New Ashok Nagar": { x: 1180, y: 640 },
            "Mayur Vihar Phase-1": { x: 1140, y: 640 },
            "Akshardham": { x: 1100, y: 640 },
            "Yamuna Bank": { x: 1060, y: 640 }
        }
    },
    {
        name: 'Mumbai',
        slug: 'mumbai',
        state: 'Maharashtra',
        description: 'Mumbai Metro connecting the financial capital of India.',
        lines: [
            {
                name: "Line 1",
                stations: [
                    "Versova", "D N Nagar", "Azad Nagar", "Andheri",
                    "Western Express Highway", "Chakala", "Airport Road",
                    "Marol Naka", "Saki Naka", "Asalpha", "Jagruti Nagar",
                    "Ghatkopar"
                ]
            },
            {
                name: "Line 2A",
                stations: [
                    "Dahisar East", "Anand Nagar", "Kandarpada", "Borivali East",
                    "Poisar", "Eksar", "Mandapeshwar", "Dahanukarwadi",
                    "Kandivali East", "Malad East", "Kurar Village", "Akurli",
                    "Poisar Depot", "Goregaon East", "Aarey Colony", "Dindoshi",
                    "Pahadi Goregaon", "Malvani", "Bangur Nagar", "Dhanukarwadi",
                    "Pahadi Eksar", "Borivali West", "Magathane", "Devipada",
                    "Rashtriya Udyan", "Dahisar West"
                ]
            },
            {
                name: "Line 7",
                stations: [
                    "Andheri East", "Chakala", "JVLR Junction", "Jogeshwari East",
                    "Aarey", "Goregaon East", "Pahadi Goregaon", "Malad East",
                    "Kurar Village", "Akurli", "Kandivali East", "Thakur Village",
                    "Poisar", "Borivali East", "Magathane", "Devipada",
                    "Rashtriya Udyan", "Dahisar East"
                ]
            }
        ],
        coordinates: {
            // Line 1 - East-West
            "Versova": { x: 100, y: 600 },
            "D N Nagar": { x: 180, y: 600 },
            "Azad Nagar": { x: 260, y: 600 },
            "Andheri": { x: 340, y: 600 },
            "Western Express Highway": { x: 420, y: 600 },
            "Chakala": { x: 500, y: 600 },
            "Airport Road": { x: 580, y: 600 },
            "Marol Naka": { x: 660, y: 600 },
            "Saki Naka": { x: 740, y: 600 },
            "Asalpha": { x: 820, y: 600 },
            "Jagruti Nagar": { x: 900, y: 600 },
            "Ghatkopar": { x: 980, y: 600 },
            // Line 2A - North-South (West)
            "Dahisar East": { x: 200, y: 50 },
            "Anand Nagar": { x: 200, y: 100 },
            "Kandarpada": { x: 200, y: 150 },
            "Borivali East": { x: 200, y: 200 },
            "Poisar": { x: 200, y: 250 },
            "Eksar": { x: 200, y: 300 },
            "Mandapeshwar": { x: 200, y: 350 },
            "Dahanukarwadi": { x: 200, y: 400 },
            "Kandivali East": { x: 200, y: 450 },
            "Malad East": { x: 200, y: 500 },
            "Kurar Village": { x: 200, y: 550 },
            "Akurli": { x: 250, y: 580 },
            "Poisar Depot": { x: 200, y: 600 },
            "Goregaon East": { x: 300, y: 650 },
            "Aarey Colony": { x: 350, y: 680 },
            "Dindoshi": { x: 300, y: 700 },
            "Pahadi Goregaon": { x: 300, y: 750 },
            "Malvani": { x: 150, y: 750 },
            "Bangur Nagar": { x: 150, y: 800 },
            "Dhanukarwadi": { x: 150, y: 850 },
            "Pahadi Eksar": { x: 150, y: 900 },
            "Borivali West": { x: 150, y: 950 },
            "Magathane": { x: 200, y: 1000 },
            "Devipada": { x: 200, y: 1050 },
            "Rashtriya Udyan": { x: 200, y: 1100 },
            "Dahisar West": { x: 200, y: 1150 },
            // Line 7
            "Andheri East": { x: 400, y: 550 },
            "JVLR Junction": { x: 450, y: 500 },
            "Jogeshwari East": { x: 400, y: 450 },
            "Aarey": { x: 380, y: 400 },
            "Thakur Village": { x: 250, y: 400 },
            "Dahisar East": { x: 200, y: 50 }
        }
    },
    {
        name: 'Bangalore',
        slug: 'bangalore',
        state: 'Karnataka',
        description: 'Namma Metro - the pride of India\'s Silicon Valley.',
        lines: [
            {
                name: "Purple Line",
                stations: [
                    "Challaghatta", "Mysuru Road", "Deepanjali Nagar", "Attiguppe",
                    "Vijayanagar", "Hosahalli", "Magadi Road", "City Railway Station",
                    "Majestic", "Cubbon Park", "MG Road", "Trinity", "Halasuru",
                    "Indiranagar", "Swami Vivekananda Road", "Baiyappanahalli"
                ]
            },
            {
                name: "Green Line",
                stations: [
                    "Nagasandra", "Dasarahalli", "Jalahalli", "Peenya Industry",
                    "Peenya", "Goraguntepalya", "Yeshwanthpur", "Sandal Soap Factory",
                    "Mahalakshmi", "Rajajinagar", "Kuvempu Road", "Srirampura",
                    "Mantri Square Sampige Road", "Majestic", "Sir M Visvesvaraya",
                    "Vidhana Soudha", "Cubbon Park", "Shivajinagar", "Cantonment",
                    "Pottery Town", "Tannery Road", "Venkateshpura", "Benniganahalli",
                    "Baiyappanahalli"
                ]
            }
        ],
        coordinates: {
            // Purple Line - East-West
            "Challaghatta": { x: 50, y: 700 },
            "Mysuru Road": { x: 130, y: 700 },
            "Deepanjali Nagar": { x: 210, y: 700 },
            "Attiguppe": { x: 290, y: 700 },
            "Vijayanagar": { x: 370, y: 700 },
            "Hosahalli": { x: 430, y: 700 },
            "Magadi Road": { x: 490, y: 700 },
            "City Railway Station": { x: 550, y: 700 },
            "Majestic": { x: 600, y: 700 },
            "Cubbon Park": { x: 700, y: 700 },
            "MG Road": { x: 780, y: 700 },
            "Trinity": { x: 860, y: 700 },
            "Halasuru": { x: 940, y: 700 },
            "Indiranagar": { x: 1020, y: 700 },
            "Swami Vivekananda Road": { x: 1100, y: 700 },
            "Baiyappanahalli": { x: 1180, y: 700 },
            // Green Line - North-South
            "Nagasandra": { x: 600, y: 50 },
            "Dasarahalli": { x: 600, y: 110 },
            "Jalahalli": { x: 600, y: 170 },
            "Peenya Industry": { x: 600, y: 230 },
            "Peenya": { x: 600, y: 290 },
            "Goraguntepalya": { x: 600, y: 350 },
            "Yeshwanthpur": { x: 600, y: 410 },
            "Sandal Soap Factory": { x: 600, y: 460 },
            "Mahalakshmi": { x: 600, y: 510 },
            "Rajajinagar": { x: 600, y: 560 },
            "Kuvempu Road": { x: 600, y: 610 },
            "Srirampura": { x: 600, y: 650 },
            "Mantri Square Sampige Road": { x: 600, y: 680 },
            "Sir M Visvesvaraya": { x: 600, y: 730 },
            "Vidhana Soudha": { x: 650, y: 730 },
            "Shivajinagar": { x: 700, y: 760 },
            "Cantonment": { x: 700, y: 810 },
            "Pottery Town": { x: 700, y: 860 },
            "Tannery Road": { x: 700, y: 910 },
            "Venkateshpura": { x: 750, y: 950 },
            "Benniganahalli": { x: 1000, y: 750 }
        }
    },
    {
        name: 'Chennai',
        slug: 'chennai',
        state: 'Tamil Nadu',
        description: 'Chennai Metro Rail connecting the cultural capital of South India.',
        lines: [
            {
                name: "Blue Line",
                stations: [
                    "Wimco Nagar", "Tiruvottiyur", "Thiruvotriyur Theradi",
                    "Kaladipet", "Tollgate", "Tondiarpet", "Washermanpet",
                    "Sir Theagaraya College", "Mannadi", "High Court",
                    "Government Estate", "LIC", "Chennai Central", "Government Hospital",
                    "Egmore", "Nehru Park", "Kilpauk Medical College", "Ashok Nagar",
                    "Vadapalani", "Arumbakkam", "Koyambedu", "CMBT",
                    "Porur", "Iyyappanthangal", "Moulivakkam", "Wimco Nagar Depot"
                ]
            },
            {
                name: "Green Line",
                stations: [
                    "Chennai Airport", "Meenambakkam", "Nanganallur Road",
                    "Alandur", "Guindy", "Little Mount", "Saidapet",
                    "Chennai Central", "Egmore", "Nehru Park", "Kilpauk Medical College",
                    "Ashok Nagar", "Vadapalani"
                ]
            }
        ],
        coordinates: {
            // Blue Line
            "Wimco Nagar": { x: 600, y: 50 },
            "Tiruvottiyur": { x: 600, y: 100 },
            "Thiruvotriyur Theradi": { x: 600, y: 150 },
            "Kaladipet": { x: 600, y: 200 },
            "Tollgate": { x: 600, y: 250 },
            "Tondiarpet": { x: 600, y: 300 },
            "Washermanpet": { x: 600, y: 350 },
            "Sir Theagaraya College": { x: 600, y: 400 },
            "Mannadi": { x: 600, y: 450 },
            "High Court": { x: 600, y: 500 },
            "Government Estate": { x: 600, y: 550 },
            "LIC": { x: 600, y: 600 },
            "Chennai Central": { x: 600, y: 650 },
            "Government Hospital": { x: 600, y: 700 },
            "Egmore": { x: 600, y: 750 },
            "Nehru Park": { x: 600, y: 800 },
            "Kilpauk Medical College": { x: 600, y: 850 },
            "Ashok Nagar": { x: 600, y: 900 },
            "Vadapalani": { x: 600, y: 950 },
            "Arumbakkam": { x: 600, y: 1000 },
            "Koyambedu": { x: 600, y: 1050 },
            "CMBT": { x: 600, y: 1100 },
            "Porur": { x: 600, y: 1150 },
            "Iyyappanthangal": { x: 600, y: 1200 },
            "Moulivakkam": { x: 600, y: 1250 },
            "Wimco Nagar Depot": { x: 600, y: 1300 },
            // Green Line
            "Chennai Airport": { x: 200, y: 1200 },
            "Meenambakkam": { x: 250, y: 1150 },
            "Nanganallur Road": { x: 300, y: 1100 },
            "Alandur": { x: 350, y: 1050 },
            "Guindy": { x: 400, y: 1000 },
            "Little Mount": { x: 450, y: 950 },
            "Saidapet": { x: 500, y: 900 }
        }
    },
    {
        name: 'Hyderabad',
        slug: 'hyderabad',
        state: 'Telangana',
        description: 'Hyderabad Metro Rail - the world\'s largest PPP metro project.',
        lines: [
            {
                name: "Red Line",
                stations: [
                    "Miyapur", "JNTU College", "KPHB Colony", "Kukatpally",
                    "Balanagar", "Moosapet", "Bharat Nagar", "Erragadda",
                    "ESI Hospital", "SR Nagar", "Ameerpet", "Punjagutta",
                    "Irrum Manzil", "Khairatabad", "Lakdi Ka Pul", "Assembly",
                    "Nampally", "Gandhi Bhavan", "Osmania Medical College",
                    "MJ Market", "Musarambagh", "Dilsukhnagar", "Chaitanyapuri",
                    "Victoria Memorial", "LB Nagar"
                ]
            },
            {
                name: "Blue Line",
                stations: [
                    "Nagole", "Uppal", "Stadium", "NGRI", "Habsiguda",
                    "Tarnaka", "Mettuguda", "Secunderabad East", "Parade Grounds",
                    "Secunderabad West", "Gandhi Hospital", "Musheerabad",
                    "RTC X Roads", "Chikkadpally", "Narayanguda", "Sultan Bazar",
                    "MG Bus Station", "Malakpet", "New Market", "Dilsukhnagar",
                    "Chaitanyapuri", "Victoria Memorial", "LB Nagar"
                ]
            },
            {
                name: "Green Line",
                stations: [
                    "JBS Parade Grounds", "Secunderabad West", "Begumpet",
                    "Ameerpet", "Madhura Nagar", "Yousufguda", "Road No 5 Jubilee Hills",
                    "Jubilee Hills Check Post", "Peddamma Temple", "Madhapur",
                    "Durgam Cheruvu", "Hi-Tech City", "Raidurg"
                ]
            }
        ],
        coordinates: {
            // Red Line
            "Miyapur": { x: 100, y: 200 },
            "JNTU College": { x: 150, y: 250 },
            "KPHB Colony": { x: 200, y: 300 },
            "Kukatpally": { x: 250, y: 350 },
            "Balanagar": { x: 300, y: 400 },
            "Moosapet": { x: 350, y: 450 },
            "Bharat Nagar": { x: 400, y: 500 },
            "Erragadda": { x: 450, y: 550 },
            "ESI Hospital": { x: 500, y: 600 },
            "SR Nagar": { x: 550, y: 650 },
            "Ameerpet": { x: 600, y: 700 },
            "Punjagutta": { x: 650, y: 750 },
            "Irrum Manzil": { x: 700, y: 800 },
            "Khairatabad": { x: 750, y: 850 },
            "Lakdi Ka Pul": { x: 800, y: 900 },
            "Assembly": { x: 850, y: 950 },
            "Nampally": { x: 900, y: 1000 },
            "Gandhi Bhavan": { x: 950, y: 1050 },
            "Osmania Medical College": { x: 1000, y: 1100 },
            "MJ Market": { x: 1050, y: 1150 },
            "Musarambagh": { x: 1050, y: 1200 },
            "Dilsukhnagar": { x: 1050, y: 1250 },
            "Chaitanyapuri": { x: 1050, y: 1300 },
            "Victoria Memorial": { x: 1050, y: 1350 },
            "LB Nagar": { x: 1050, y: 1400 },
            // Blue Line
            "Nagole": { x: 1400, y: 700 },
            "Uppal": { x: 1350, y: 700 },
            "Stadium": { x: 1300, y: 700 },
            "NGRI": { x: 1250, y: 700 },
            "Habsiguda": { x: 1200, y: 700 },
            "Tarnaka": { x: 1150, y: 700 },
            "Mettuguda": { x: 1100, y: 700 },
            "Secunderabad East": { x: 1050, y: 700 },
            "Parade Grounds": { x: 1000, y: 700 },
            "Secunderabad West": { x: 950, y: 700 },
            "Gandhi Hospital": { x: 900, y: 700 },
            "Musheerabad": { x: 850, y: 700 },
            "RTC X Roads": { x: 800, y: 700 },
            "Chikkadpally": { x: 750, y: 700 },
            "Narayanguda": { x: 700, y: 700 },
            "Sultan Bazar": { x: 650, y: 700 },
            "MG Bus Station": { x: 600, y: 700 },
            "Malakpet": { x: 550, y: 700 },
            "New Market": { x: 500, y: 700 },
            // Green Line
            "JBS Parade Grounds": { x: 950, y: 650 },
            "Begumpet": { x: 900, y: 600 },
            "Madhura Nagar": { x: 800, y: 600 },
            "Yousufguda": { x: 750, y: 600 },
            "Road No 5 Jubilee Hills": { x: 700, y: 600 },
            "Jubilee Hills Check Post": { x: 650, y: 600 },
            "Peddamma Temple": { x: 600, y: 600 },
            "Madhapur": { x: 550, y: 600 },
            "Durgam Cheruvu": { x: 500, y: 600 },
            "Hi-Tech City": { x: 450, y: 600 },
            "Raidurg": { x: 400, y: 600 }
        }
    }
];

const importData = async () => {
    try {
        // Clear existing data
        await Station.deleteMany();
        await City.deleteMany();
        console.log('Cleared existing data...');

        for (const cityData of citiesData) {
            // Create city
            const city = await City.create({
                name: cityData.name,
                slug: cityData.slug,
                state: cityData.state,
                description: cityData.description,
                totalLines: cityData.lines.length,
                isActive: true
            });

            console.log(`Created city: ${city.name}`);

            // Build station map for this city
            const stationMap = {};

            cityData.lines.forEach(lineCtx => {
                lineCtx.stations.forEach((stationName, index) => {
                    if (!stationMap[stationName]) {
                        const coords = cityData.coordinates[stationName] || { x: 100, y: 100 };
                        stationMap[stationName] = {
                            name: stationName,
                            city: city._id,
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

            // Update city with total stations count
            await City.findByIdAndUpdate(city._id, {
                totalStations: stationsToInsert.length
            });

            console.log(`  → Inserted ${stationsToInsert.length} stations`);
        }

        console.log('\n✅ All data imported successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Station.deleteMany();
        await City.deleteMany();
        console.log('✅ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
