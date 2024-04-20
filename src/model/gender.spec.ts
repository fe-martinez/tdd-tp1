import { Gender } from "./gender";

describe('gender', () => {
    it('should return true if exists in enum', () => {
        expect(Gender.isValid('male')).toBeTruthy()
    });

    it('should return false if not exists in enum', () => {
        expect(Gender.isValid('unknown')).toBeFalsy()
    });
});
