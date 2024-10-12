const baseURL = 'http://192.168.0.103:5000/api/';
// const baseURL = 'http://192.168.100.89:5000/api/';
const signupURL = 'auth/register';
const loginURL = 'auth/login';
const prayerTimesURL = 'prayer-times';
const mosqueInfoURL = '/mosque-info/';
const appName = 'Markazi Jamia Gausia Masjid';
const verifyTokenURL='auth/verify/'
const GET = 'GET';
const POST = 'POST';

module.exports = {
  baseURL,
  signupURL,
  loginURL,
  GET,
  POST,
  prayerTimesURL,
  appName,
  mosqueInfoURL,
  verifyTokenURL
};
