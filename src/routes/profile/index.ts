import express, { Request, Response } from 'express';
import { authenticateToken } from '../../middleware/jwt';
import sharp from 'sharp';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const imagesDirectory = './public/images';

const upload = multer();

router.post('/image', upload.single('image'), authenticateToken, (req, res) => {

    if (!req.file) {
        return res.status(400).send('No se ha enviado ninguna imagen.');
    }

    const id = req.body.user.id;
    const filename = `${id}.jpg`;
    const image = sharp(req.file.buffer);

    image.metadata()
        .then(metadata => {
            if (!metadata.width || !metadata.height)
                return Promise.reject({ statusCode: 500 })

            const isBetween = (min: number, max: number, value: number) => value >= min && value <= max;

            if (!isBetween(128, 1024, metadata.width) || !isBetween(128, 1024, metadata.height)) {
                const sizeString = `${metadata.width}x${metadata.height}`
                return Promise.reject({ statusCode: 400, message: `The image must be between 128x128 and 1024x1024 pixels. Actual size: ${sizeString}` });
            }

            if (!fs.existsSync(imagesDirectory))
                fs.mkdirSync(imagesDirectory, { recursive: true });

            return image.jpeg({ mozjpeg: true, quality: 50 }).toFile(`${imagesDirectory}/${filename}`)
        })
        .then(() => res.sendStatus(201))
        .catch(error => res.status(error.statusCode || 500).send({ message: 'An error occurred while processing the image.', error: error.message || "" }));
});

router.get('/image', authenticateToken, (req, res) => {
    const id = req.body.user.id;
    const filename = `${id}.jpg`;

    if (!fs.existsSync(`${imagesDirectory}/${filename}`)) {
        return res.status(404).send('No se ha encontrado ninguna imagen.');
    }

    res.sendFile(`${imagesDirectory}/${filename}`, { root: '.' });
});

export default router;