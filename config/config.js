export const conf = {
    secret: "SECRET_KEY_RANDOM",
    token: {
        accessToken: {
            typeToken: 'access',
            live: '300h'
        },
        refreshToken: {
            typeToken: 'refresh',
            live: '24h'
        }
    }
}