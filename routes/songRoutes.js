import express from "express";
import { faker } from '@faker-js/faker';
const routes = express(); //const routes = express.Router();
import Songs from "../models/Songs.js"

routes.get('/', function (req, res) {
    res.send('Hello World!!!!!')
})

// {
//     "items": [ …hier de collectie met items… ],
//     "_links" : { …met link naar self…},
//     "pagination": {
//         temp: “pagination maken we later af”
//     }
// }

routes.listen(8000, () => {
    console.log("webserver werkt op post 8000")
})




























// Seeden van de database
// ▸ Omdat de database nog leeg is als we beginnen doet GET niet
// zoveel
// ▸ Handig om eerst een seeder te maken die (fake) data in de
// database zet

// POST overloading
// ▸ Alle methods in HTTP zijn eenduidig behalve POST
// ▸ Dus POST is enige optie
// ▸ We sturen dan een parameter method mee waarin we de
// methode zetten die in HTTP ontbreekt
// ▸ Het “misbruiken” van POST noemen we POST overloading
// ▸ LET OP! Omdat je nu afwijkt van standaards is het belangrijk
// dat je dit goed documenteert!