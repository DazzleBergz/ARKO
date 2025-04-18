// API AND KEY
export const serverURL = "https://arkovessel.com"

export const googleAPIKEY = "AIzaSyC9lNLLdWVWW0mRKcUZRQC5v6oSrFLFGm8"
// Create account
export const accountCreateOTP = `${serverURL}/api/request-otp`;
export const verifyOTP = `${serverURL}/api/verify-otp`;
export const registerAccount = `${serverURL}/api/register`;

// Reset account
export const forgotOTP = `${serverURL}/api/forgot`;
export const resetPassword = `${serverURL}/api/reset`

// Access
export const userInfos = `${serverURL}/api/userinfos`;
export const loginAccount = `${serverURL}/api/login`;
export const logoutAccount = `${serverURL}/api/logout`;
export const updateUser = `${serverURL}/api/userinfos/update-user`;
export const userProfile = `${serverURL}/api/userinfos/image`
export const checkToken = `${serverURL}/api/tokenCheck`

//email
export const requestEmail = `${serverURL}/api/request-email`;
export const verifyEmail = `${serverURL}/api/verify-email`;
export const changeEmail = `${serverURL}/api/change`;

export const emergencyRequest = `${serverURL}/api/rescues/request`
export const userRequests = `${serverURL}/api/rescues/user`
export const updateRequest = `${serverURL}/api/rescues/update`

//Notif
export const notifListen = `${serverURL}/api/rescues/rescue-status`   

//Vessel
export const vesselData = `${serverURL}/api/vessels`

//support email
export const supportEmail = `arko.support@example.com` 