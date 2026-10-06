import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    authors: { type: String, default: '' },
    favorite: { type: String, default: '' },
    fileCover: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileBook: { type: String, default: '' }, // путь к загруженному файлу
}, {
    timestamps: true,
    versionKey: false,
});

export default mongoose.model('Book', bookSchema);