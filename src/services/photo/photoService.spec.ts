import { PhotoUploader } from ".";
import { InvalidSizeError } from "./errors";
import fs from "fs";

const BASE_PATH = "./src/services/photo/test"; // pasar a variable de entorno

describe("PhotoUploader", () => {
    describe("validatePhoto", () => {
        it("should throw an error if the photo is too small", async () => {
            const photo = fs.readFileSync(`${BASE_PATH}/small.png`);
            const uploader = new PhotoUploader(photo, "small");
            await expect(uploader.validatePhoto()).rejects.toThrow(InvalidSizeError);
        });

        it("should throw an error if the photo is too large", async () => {
            const photo = fs.readFileSync(`${BASE_PATH}/large.png`);
            const uploader = new PhotoUploader(photo, "large");
            await expect(uploader.validatePhoto()).rejects.toThrow(InvalidSizeError);
        });

        it("should not throw an error if the photo is within the size limits", async () => {
            const photo = fs.readFileSync(`${BASE_PATH}/valid.jpg`);
            const uploader = new PhotoUploader(photo, "valid");
            await expect(uploader.validatePhoto()).resolves.not.toThrow(InvalidSizeError);
        });
    });
});