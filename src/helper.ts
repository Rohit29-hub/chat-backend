import jwt from 'jsonwebtoken';
const jwtSecret = "rohitkohli@1977"

export const signJwtToken = (payload: any) => {
    const token = jwt.sign(payload,jwtSecret,{
        expiresIn: '1d'
    });
    return token;
}
