import Boss from './jefes.controller.js'
import Validation from '../utils/fieldValidation.js'
async function signup (req,res) {
    console.log(req.body);
    let {signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd} = req.body
    for (let field in req.body) {
        valNames()
    }
    // let result = await Boss.signup(signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd)
}
export default signup;