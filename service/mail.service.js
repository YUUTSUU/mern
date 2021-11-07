const nodemailer = require("nodemailer")

const mailService = {
  async login(email, url, info) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: `Succesful sign in for <${ process.env.SMTP_USER }>`,
        to: email,
        subject: "App",
        text: "",
        html: `
          <div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 20px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase; color: teal;">Welcome!</h2>

            <h4>Sign in for ${ email }</h4>

            <p>Timestamp: ${ info.timeStamp }</p>
            <p>IP Address: ${ info.ipAddress }</p>
            <p>User Agent: ${ info.userAgent }</p>

            <p>You received this message because of a successful login from your device. If you believe that this sign in is suspicios, <a href=${ url }>please reset youre password immediately.</a></p>

            <p>If you believe that this sign in is suspicios, please reset youre password immediately.
            if you're aware of this sign in, please disregard this notice.</p>

            <p>Thanks</p>

            <p>App</p>

          </div>
        `
      })
    } catch (err) {console.log(err.message)}
  },
  async register(email, url, info, name) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: `Confirm your email address! <${ process.env.SMTP_USER }>`,
        to: email,
        subject: "App",
        text: "",
        html: `
          <div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 20px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase; color: teal;">Welcome!</h2>

            <h4>Confirm for ${ email }</h4>

            <p>Timestamp: ${ info.timeStamp }</p>
            <p>IP Address: ${ info.ipAddress }</p>
            <p>User Agent: ${ info.userAgent }</p>

            <p>Congratulations ${ name }, you just have to confirm your email.</p>

            <p>Click the button below to verify your email.</p>

            <a href=${ url } style="background: #20B2AA; box-shadow: 0 0 10px #e3e3e3; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Confirm email</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div style="margin-bottom: 20px;">${ url }</div>

            <p>Thanks</p>

            <p>App</p>
          </div>
        `
      })
    } catch (e) {console.log(e.message)}
  },
  async google(email, info) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: `Succesful sign in for <${ process.env.SMTP_USER }>`,
        to: email,
        subject: "App",
        text: "",
        html: `
          <div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 20px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase; color: teal;">Welcome!</h2>

            <h4>Sign in for ${ email }</h4>

            <p>Timestamp: ${ info.timeStamp }</p>
            <p>IP Address: ${ info.ipAddress }</p>
            <p>User Agent: ${ info.userAgent }</p>

            <p>You received this message due to a successful login from your device with your google account</p>

            <p>Thanks</p>

            <p>App</p>

          </div>
        `
      })
    } catch (e) {console.log(e.message)}
  }
}

module.exports = mailService