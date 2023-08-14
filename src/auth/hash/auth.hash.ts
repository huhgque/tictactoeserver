import * as bcrypt from 'bcrypt'
export const hashPassword = async (password : string)=>{
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password,salt)
    return hash
}

export const checkPassword = async (password:string,hashedPassword:string):Promise<Boolean> => {
    return bcrypt.compare(password,hashedPassword)
}