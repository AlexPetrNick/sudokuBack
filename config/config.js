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
    },
    pathImagesUpload: './images/upload/',
    nameAddOriginImage: 'origin',
    addressServer: 'http://localhost:3000/',
    staticImages: 'http://localhost:3000/images/',
    uploadImages: 'http://localhost:3000/images/upload/'
}