import * as nodemailer from 'nodemailer'

export const sendEmail = (userId) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'nyasia39@ethereal.email',
      pass: 'DT5NAbHqQyCYXqvajX'
    }
  })

  //Message object
  const message = {
    from: 'TheAutoground Sticker Generator <support_theautoground@gmail.com>',
    to: 'Chairman Bao <admin_theautoground@gmail.com>',
    subject: 'Sticker for ' + userId,
    text: 'Attached below is the sticker for ' + userId, //plaintext body
    html: `<p>Attached below is the sticker:</p>
          <br/><img src="cid:nyan@example.com"/>`
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occured: %s" + err.message)
    }

    console.log("Message sent: %s", info.messageId)
    console.log("Preview Url: %s", nodemailer.getTestMessageUrl(info))
  })
}