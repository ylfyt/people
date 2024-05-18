import { UserClaim } from '../dtos/claim.js';
import jwt from 'jsonwebtoken';

export function generateJwtToken(claim: UserClaim, key: string) {
    const token = jwt.sign(claim, key, {});
    return token;
}