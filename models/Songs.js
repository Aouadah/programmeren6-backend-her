import mongoose from "mongoose";

const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: String,
    body: String,
    author: String
});

const Song = mongoose.model('Song', songSchema);

export default Song




























// Mongoose
// ▸ Is GEEN database, maar een module om te verbinden met je
// Mongo-database
// ▸ Gebruik je om via Javascript met de database te
// communiceren

// Schema
// ▸ Geeft aan hoe het model in de database eruit ziet
// ▸ Hierin staat welke properties een model heeft, en van welk
// type ze zijn
// ▸ Kan ook virtuele properties hebben