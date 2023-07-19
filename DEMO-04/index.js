const nodemailer = require('nodemailer')
const settings = require('./config')

function sendEmail(email, subject, text, html, files, callback) {
  const transporter = nodemailer.createTransport({
    host: settings.SMTP,
    auth: {
      user: settings.EMAIL_ADDRESS,
      pass: settings.PASS
    }
  })
  const mailOptions = {
    from: settings.EMAIL_ADDRESS,
    to: email, //多个邮箱“，”隔开
    subject: subject,
    text: text != undefined ? text : null,
    html: html != undefined ? html : null,
    attachments: files != undefined ? files : null
    // file: {
    //   filename: '',
    //   path: ''
    // }
  }
  const result = {
    httpCode: 200,
    message: '邮件发送成功',
  }
  try {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        result.httpCode = 500;
        result.message = err;
        callback(result);
        return;
      }
      callback(result);
    })
  } catch (e) {
    result.httpCode = 500;
    result.message = e;
    callback(result);
  }
}

const mail = ''
sendEmail('huang15057081701@163.com','测试',mail,undefined,undefined,(data) => {
  console.log(data)
})
module.exports = { sendEmail }