import { Request, Response } from 'express';
import HTTPErrorCodes from '../utilities/httpErrorCodes';
import fs from 'fs';
import { UserService } from '../services/user';
import { updateableUserProperties } from '../model/updateableUserProperties';
import HTTPSuccessCodes from '../utilities/httpSuccessCodes';
import { Gender } from '../model/gender';
import { InvalidSizeError } from '../services/photoUploader/errors';
import { ProfileUpdater } from '../services/profileUpdater/profile';
import { userValidSchema } from '../model/userValidSchema';

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
    return new UserService()
        .updatePhoto(id, req.file.buffer, id.toString())
        .then(() => res.sendStatus(201))
        .catch(err => {
            if (err instanceof InvalidSizeError) {
                return res.status(HTTPErrorCodes.BadRequest).send(err.message);
            }
            return res.status(HTTPErrorCodes.InternalServerError).send('An error occurred while processing the photo.')
        });
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
        .deletePhoto(id)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).send('An error occurred while deleting the photo.'));
}

// Función para actualizar el email
const updateEmail = async (id: number, newEmail: string, userService: UserService) =>
    userService.changeUserEmailById(id, newEmail);


const updatePassword = async (id: number, newPassword: string, userService: UserService) =>
    userService.changeUserPasswordById(id, newPassword);


// Función para actualizar el género
const updateGender = async (id: number, newGender: string, userService: UserService) =>
    userService.changeUserGenderById(id, newGender);

// Función para actualizar el género
const updateFirstName = async (id: number, newName: string, userService: UserService) => 
userService.changeUserFirstNameById(id, newName);

const operationsHandlers: Record<string, (id: number, value: string, userService: UserService) => void> = {
    [updateableUserProperties.email]: updateEmail,
    [updateableUserProperties.password]: updatePassword,
    [updateableUserProperties.gender]: updateGender,
    [updateableUserProperties.firstName]: updateFirstName
};


async function updateProfile(req: Request, res: Response) {
    const profileUpdater = new ProfileUpdater();
    try {
        profileUpdater.update(req.body, req.body.user.id);

    }
    catch(error) {

    }

    return res.status(HTTPSuccessCodes.OK).json("Ok");

    // Verificar si las operaciones en el cuerpo de la solicitud son válidas
    // if (!areOptionsValid(updates)) {
    //     return res.status(HTTPErrorCodes.BadRequest).json({ error: 'Invalid updates!' });
    // }

    // if (Gender.isValid(updates)) {}

    // try {
    //     // Iterar sobre las opciones válidas y llamar a la función correspondiente para cada una
    //     for (const key of Object.keys(updates)) {
    //         const update = key as updateableUserProperties;
    //         const newValue = updates[update];
    //         if (operationsHandlers[update]) {
    //             await operationsHandlers[update](id, newValue, userService); // Llama a la función correspondiente
    //         }
    //     }

    //     let user = await userService.getUserById(id);
    //     return res.status(HTTPSuccessCodes.OK).json(user);
    // } catch (error) {
    //     return res.status(HTTPErrorCodes.InternalServerError).json({ error: 'An error occurred while updating profile' });
    // }
}

function getFollowers(req: Request, res: Response) {
    const userID = req.body.user.id;
    new UserService()
        .getFollowersByUserId(userID)
        .then(followers => res.json(followers))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({ message: 'An error ocurred while retrieving followers', error: err }));
}

function getFollowing(req: Request, res: Response) {
    const userID = req.body.user.id;
    new UserService()
        .getFollowingByUserId(userID)
        .then(following => res.json(following))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({ message: 'An error ocurred while retrieving following', error: err }));
}

export default { getProfile, updateProfilePhoto, getProfilePhoto, deleteProfilePhoto, updateProfile, getFollowers, getFollowing };