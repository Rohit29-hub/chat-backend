import jwt from 'jsonwebtoken';
const jwtSecret = "rohitkohli@1977"

export const signJwtToken = (payload: any) => {
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: '1d'
    });
    return token;
}


// check the user in map and update their status
export const updateUser = (map: Map<any, any>, profile: any, newSocketId: string) => {
    
    for (let [key, value] of map.entries()) {
        if (value._id === profile._id) {
            map.delete(key); // delete the previous user connection
            break;
        }
    }
    
    // change the status and set in the map
    profile.status = 'online';
    map.set(newSocketId, profile)
}
