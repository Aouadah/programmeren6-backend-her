import express from "express";
import { faker } from '@faker-js/faker';
import Song from "../models/Songs.js"

const routes = express.Router();

const checkAcceptHeader = (req, res, next) => {
    const acceptHeader = req.get('Accept');

    if (acceptHeader !== 'application/json') {
        res.status(406).json({ message: 'Not Acceptable' });
        return;
    }

    next();
};

const checkContentTypeHeader = (req, res, next) => {
    const contentTypeHeader = req.get('Content-Type');

    if (contentTypeHeader !== 'application/json' && contentTypeHeader !== 'application/x-www-form-urlencoded') {
        res.status(415).json({ message: 'Unsupported Media Type' });
        return;
    }

    next();
};

// GET method to fetch songs
routes.get('/', checkAcceptHeader, async (req, res) => {
    try {
        // const songs = await Song.find();
        // const response = {
        //     items: [],
        //     _links: {
        //         self: { href: `${req.protocol}://${req.get('host')}/` }
        //     },
        //     pagination: {
        //         temp: "pagination maken we later af"
        //     }
        // };


        // // Loop through songs and add _links for each item
        // for (let song of songs) {
        //     response.items.push({
        //         ...song.toObject(),
        //         _links: {
        //             self: { href: `${req.protocol}://${req.get('host')}/${song._id}` },
        //             collection: { href: `${req.protocol}://${req.get('host')}/` }
        //         }
        //     });
        // }
        let query = Song.find({});
        const songs = await query.exec();

        let items = songs.map((song) => {
            const songObject = song.toObject();
            return {
                ...songObject,
                _links: {
                    self: { href: `${req.protocol}://${req.get('host')}/${song._id}` }
                }
            };
        });

        const response = {
            items: items,
            _links: {
                self: { href: `${req.protocol}://${req.get('host')}/` }
            },
            pagination: {
                _links: {

                }
            }
        };
        res.status(200).json(response);
    } catch (err) {
        console.error("Error fetching songs:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET ID to fetch only one song
routes.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        const songObject = song.toObject();
        const response = {
            ...songObject,
            _links: {
                self: { href: `${req.protocol}://${req.get('host')}/${song._id}` },
                collection: { href: `${req.protocol}://${req.get('host')}/` }
            }
        };
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');


        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Internal Server Error' });
    }
});

// POST method to seed the database with fake songs
routes.post('/seed',async (req, res)=>{
    if (req.body?.METHOD ==='SEED'){
        console.log('Seed DB');
        await Song.deleteMany({});
        for (let i =0; i < 10;i++){
            await Song.create({
                title:faker.music.songName(),
                album: faker.lorem.sentence({min:1, max:4}),
                artist: faker.person.fullName()
            })
        }
        res.json({ message: "Het werkt" })
    }else{
        res.status(400).json({ message: "Bad Request" })
    }
});

// POST method to save songs
routes.post('/', checkContentTypeHeader, async (req, res) => {
    const { title, album, artist } = req.body;
    if (!title || !album || !artist) {
        res.status(400).json({ message: 'Fields "title", "album", and "artist" are required' });
        return;
    }

    try {
        const newSong = await Song.create({
            title,
            album,
            artist,
        });

        res.status(201).json({
            message: 'Song created successfully',
            newSong: {
                ...newSong.toObject(),
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// OPTIONS method to allow different methods
routes.options("/", (req, res) => {
    // Specify allowed methods in the response header
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.sendStatus(200);
});

// OPTIONS method for only one song
routes.options("/:id", (req, res) => {
    res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.sendStatus(200);
});

// PUT method to update song data
routes.put('/:id', async (req, res) => {
    const { title, album, artist } = req.body

    if (title === '' || album === ''  || artist === '') {
        res.status(400).json({ message: 'Fields cannot be empty' });
        return;
    }

    try {
        // Check if _id is provided in the request body
        if (!req.params.id) {
            return res.status(400).json({ message: '_id is required for update' });
        }

        const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            message: 'Song updated successfully',
            updatedSong: {
                ...updatedSong.toObject(),
                _links: {
                    self: {href: `${req.protocol}://${req.get('host')}/${updatedSong._id}`},
                    collection: {href: `${req.protocol}://${req.get('host')}/`}
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// DELETE method to delete a song
routes.delete('/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.status(204).json("No Content");
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

export default routes;


