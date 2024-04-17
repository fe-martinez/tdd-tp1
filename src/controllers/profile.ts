import e, { Request, Response } from 'express';
import HTTPErrorCodes from '../utilities/httpErrorCodes';
import sharp from 'sharp';
import fs from 'fs';
import { UserService } from '../services/userService';

const photosDirectory = './public/images';

function getProfile(req: Request, res: Response) {
    const id = req.body.user.id;
    new UserService()
        .getUserById(id)
        .then(user => {
            if (!user) {
                return res.status(HTTPErrorCodes.NotFound).send('User not found.');
            }

            res.json(user);
        })
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).send('An error occurred while getting the user.'));
}

function updateProfilePhoto(req: Request, res: Response) {
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

}

function getProfilePhoto(req: Request, res: Response) {
    const id = req.body.user.id;
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

function deleteProfilePhoto(req: Request, res: Response) {
    const id = req.body.user.id;
    new UserService()
        .updatePhoto(id, "")
        .then(() => res.sendStatus(204))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).send('An error occurred while deleting the photo.'));
}

function getFollowers(req: Request, res: Response) {
    const userID = req.body.user.id;
    new UserService()
        .getFollowersByUserId(userID)
        .then(followers => res.json(followers))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({message: 'An error ocurred while retrieving followers', error: err}));
}

function getFollowing(req: Request, res: Response) {
    const userID = req.body.user.id;
    new UserService()
        .getFollowingByUserId(userID)
        .then(following => res.json(following))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({message: 'An error ocurred while retrieving following', error: err}));
}

export default { getProfile, updateProfilePhoto, getProfilePhoto, deleteProfilePhoto, getFollowers, getFollowing };