import express, { Request, Response } from 'express';
import { authenticateToken } from '../../middleware/jwt';
import sharp from 'sharp';
import multer from 'multer';
import fs from 'fs';
import { UserService } from '../../services/userService';
import HTTPErrorCodes from '../../utilities/httpErrorCodes';

const router = express.Router();

const photosDirectory = './public/images';

const upload = multer();

router.post('/photo', upload.single('photo'), authenticateToken, (req, res) => {

    if (!req.file) {
        return res.status(HTTPErrorCodes.NotFound).send('No photo found in the request.');
    }

    const id = req.body.user.id;
    const filename = `${id}.jpg`;
    const photo = sharp(req.file.buffer);

    photo.metadata()
        .then(metadata => {
            if (!metadata.width || !metadata.height)
                return Promise.reject({ statusCode: 500 })

            const isBetween = (min: number, max: number, value: number) => value >= min && value <= max;

            if (!isBetween(128, 1024, metadata.width) || !isBetween(128, 1024, metadata.height)) {
                const sizeString = `${metadata.width}x${metadata.height}`
                return Promise.reject({ statusCode: 400, message: `The photo must be between 128x128 and 1024x1024 pixels. Actual size: ${sizeString}` });
            }

            if (!fs.existsSync(photosDirectory))
                fs.mkdirSync(photosDirectory, { recursive: true });

            const pathToPhoto = `${photosDirectory}/${filename}`;
            return photo.jpeg({ mozjpeg: true, quality: 50 })
                .toFile(pathToPhoto)
                .then(() => new UserService().updatePhoto(id, pathToPhoto));
        })
        .then(() => res.sendStatus(201))
        .catch(error => res.status(error.statusCode || HTTPErrorCodes.InternalServerError).send({ message: 'An error occurred while processing the photo.', error: error.message || "" }));
});

router.get('/photo', authenticateToken, (req, res) => {
    const id = req.body.user.id;
    getUserPhoto(id, res)
});

// TODO: este creo que deberia ir a otro lado. Obtiene la imagen de cualquier usuario
router.get('/photo/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    getUserPhoto(id, res)
});

router.delete('/photo', authenticateToken, (req, res) => {
    const id = req.body.user.id;
    new UserService()
        .updatePhoto(id, "")
        .then(() => res.sendStatus(204))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).send('An error occurred while deleting the photo.'));
});

function getUserPhoto(id: number, res: Response) {
    new UserService()
        .getUserById(id)
        .then(user => {
            if (!user) {
                return res.status(HTTPErrorCodes.NotFound).send('User not found.');
            }

            if (!fs.existsSync(user.photo) || user.photo === "") {
                return res.status(HTTPErrorCodes.NotFound).send('Photo not found for user.');
            }

            res.sendFile(user.photo, { root: '.' });
        })
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).send('An error occurred while getting the photo.'));
    
}

export default router;