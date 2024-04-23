import { Request, Response } from 'express';
import { UserService } from '../services/user';
import HTTPSuccessCodes from '../utilities/httpSuccessCodes'; 
import HTTPErrorCodes from '../utilities/httpErrorCodes';

function getAllUsers(req: Request, res: Response) {
    const {firstName, lastName, hobby, page} = req.query;

    new UserService()
        .getUsers(      
            firstName ? firstName as string : undefined,
            lastName ? lastName as string : undefined, 
            hobby ? parseInt(hobby as string) : undefined,
            page ? parseInt(page as string) : undefined)
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: 'Error getting users', error: err }));
}

function getUserProfileById(req: Request, res: Response) {
    new UserService()
        .getUserById(parseInt(req.params.id))
        .then(user => user ? res.json(user) : res.status(404).json({ message: 'User not found' }))
        .catch(err => res.status(500).json({ message: 'Error getting user', error: err }));
}

function followUser(req: Request, res: Response) {
    const userIdToFollow = parseInt(req.params.id);
    const followerUserId = req.body.user.id;
    new UserService()
        .followUser(followerUserId, userIdToFollow)
        .then(user => res.status(HTTPSuccessCodes.OK).json(user))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({message: 'Error while following user', error: err}));
}

function unfollowUser(req: Request, res: Response) {
    const userIdToUnfollow = parseInt(req.params.id);
    const followerUserId = req.body.user.id;
    new UserService()
      .unfollowUser(followerUserId, userIdToUnfollow)
      .then(() => res.status(HTTPSuccessCodes.OK).json({message: 'User unfollowed succesfully'}))
      .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({message: 'Error while unfollowing user', error: err}));
}

function getOtherUserFollowers(req: Request, res: Response) {
    const userID = parseInt(req.params.id);
    new UserService()
        .getFollowersByUserId(userID)
        .then(followers => res.json(followers))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({message: 'An error ocurred while retrieving followers', error: err}));
}

function getOtherUserFollowing(req: Request, res: Response) {
    const userID = parseInt(req.params.id);
    new UserService()
        .getFollowingByUserId(userID)
        .then(following => res.json(following))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({message: 'An error ocurred while retrieving following', error: err}));
}

function getAllHobbies(req: Request, res: Response) {
    new UserService()
        .getAllHobbies()
        .then(hobbies => res.json(hobbies))
        .catch(err => res.status(HTTPErrorCodes.InternalServerError).json({ message: 'An error occurred while retrieving hobbies', error: err }));
}
function getAllGenders(req: Request, res: Response) {
    new UserService()
        .getAllGenders()
        .then(genders => res.json(genders))
        .catch(err => res.status(500).json({ message: 'An error occurred while retrieving genders', error: err }));
}

export default { getAllUsers, getUserProfileById, followUser, unfollowUser, getOtherUserFollowers, getOtherUserFollowing, getAllHobbies, getAllGenders}