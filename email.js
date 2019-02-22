
/**
 * Created by duyetmai on 6/17/18.
 */
let rp = require('request-promise');
let fs = require('fs');
var login_token = "mxy8eyfbya1vlenixlyxaswfgd1vznyw"
let user_id = "123502"
let URL_LOGIN = "http://musicapp2017.learnbyheart.vn/sign-in"
let URL_GET_SONG_LIBRARY = 'http://vocaapp2017.voca.vn/get-personal-library'
var csvWriter = require('csv-write-stream')
var writer = csvWriter()
let user_id_start = 471942
writer.pipe(fs.createWriteStream(`data_voca_user${user_id_start}.csv`, {encoding: 'utf-8'}))

//start=0&login_token=w9edlgcxym1hq0lvsm45m1kjrj3g8qom&limit=20&user_id=123502

// http://musicapp2017.learnbyheart.vn/get-kind-of-music
// http://musicapp2017.learnbyheart.vn/get-band-singer-kind-id
// start=16&login_token=ddoiachojfrzb9riktvf6jgnvbmtgnej&list_kind_id=13_12_11&limit=8&user_id=448218


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
  let options = {
    method: 'POST',
    uri: URL_LOGIN,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: 'email=vocavn123%40mailinator.com&password=voca123'

  };


  let body = await rp(options)
  body = body.trim()
  body = JSON.parse(body)
  let token = body.userInfo.login_token
  login_token = token
  console.log("TOKEN:" + login_token)
  return token


}

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request_user_info(login_token, user_id) {
  let options = {
    method: 'POST',
    uri: URL_GET_SONG_LIBRARY,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    timeout: 30000
  }
  options.body = `login_token=${login_token}&&user_id=${user_id}`
  let body = {}
  try {
    body = await rp(options)
  }
  catch (err) {
    console.log(err.code === 'ETIMEDOUT');
    await sleep(60000);
    body = await rp(options)

  }
  body = JSON.parse(body.trim())
  return body
}

async function get_email_account() {

  list = []
  for (let i = user_id_start; i < 900000; i++) {
    user_id = pad(i, 6)
    let body = await request_user_info(login_token, user_id)

    if (!body.isSuccess) {
      continue
    }
    let user = body.userDetail
    let item = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      activated_at: user.activated_at,
      last_login: user.last_login,
      created_at: user.created_at,
      date_of_birth: user.date_of_birth
    }
    writer.write(item)
    console.log(user.id)

  }
  writer.end()


}


async function main() {
  login_token = await login()
  await get_email_account()


}

main()



