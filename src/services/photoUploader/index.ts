import sharp from "sharp";
import fs from "fs";
import 'dotenv/config';
import { InvalidSizeError } from "./errors";

const MIN_SIZE_IN_PIXELS = 256;
const MAX_SIZE_IN_PIXELS = 1024;
const MAX_SIZE_IN_BYTES = 1024 * 1024;
const QUALITY = 50;

function validateSizeInPixels(width: number, height: number) {
    const isValidSize = (value: number) => value >= MIN_SIZE_IN_PIXELS && value <= MAX_SIZE_IN_PIXELS;
    if (!isValidSize(width) || !isValidSize(height)) {
        const currentSizeString = `${width}x${height}`;
        const expectedSizeString = `${MIN_SIZE_IN_PIXELS}x${MIN_SIZE_IN_PIXELS} and ${MAX_SIZE_IN_PIXELS}x${MAX_SIZE_IN_PIXELS}`;
        throw new InvalidSizeError(expectedSizeString, currentSizeString);
    }
}

function validateSizeInBytes(size: number) {
    if (size === 0 || size > MAX_SIZE_IN_BYTES) {
        throw new InvalidSizeError("0KB and 1MB", `${size / 1024}KB`);
    }
}

export class PhotoUploader {
    private photo: sharp.Sharp;
    private filename: string;

    constructor(file: Buffer, filename: string) {
        this.photo = sharp(file.buffer);
        this.filename = filename;
    }

    async validatePhoto(): Promise<void> {
        return this.photo.metadata()
            .then(({ width, height, size }) => {
                validateSizeInPixels(width || 0, height || 0);
                validateSizeInBytes(size || 0);
            })
    }

    async uploadPhoto(): Promise<string> {
        return this.validatePhoto()
        .then(async () => {
            const BASE_PATH = process.env.PROFILE_PHOTOS_DIRECTORY;
            if (!BASE_PATH) {
                throw new Error('PROFILE_PHOTOS_DIRECTORY is not defined in the environment.');
            }
            
            if (!fs.existsSync(BASE_PATH))
                fs.mkdirSync(BASE_PATH, { recursive: true });
    
            const pathToPhoto = `${BASE_PATH}/${this.filename}.jpg`;
            return this.photo.jpeg({ quality: QUALITY })
                .toFile(pathToPhoto)
                .then(() => pathToPhoto);
        })
    }
}