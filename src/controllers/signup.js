import Boss from './jefes.controller.js'

async function signup (req,res) {
    console.log(req.body);
    let {signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd} = req.body
    
    // let result = await Boss.signup(signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd)
}
export default signup;