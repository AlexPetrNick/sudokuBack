import User from "../../models/User.js";


export const getListGroup = async (req, res) => {
    try {

    } catch (e) {

    }
}

export const getListUser = async (req, res) => {
    try {
        const users = await User.find()
        const result = users.map(u => {
            const username = u.username
            const email = u.email ? u.email : null
            const firstName = u.firstName ? u.firstName : null
            const lastName = u.lastName ? u.lastName : null
            return {
                username, email, firstName, lastName
            }
        })
        res.json({result})
    } catch (e) {
        console.log(e)
    }
}

export const getListMenuItem = async (req, res) => {
    try {

    } catch (e) {

    }
}