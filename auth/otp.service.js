const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const {htmlToText} = require('html-to-text');
const juice = require('juice');
const path = require('path');

module.exports ={
    sendOtpToEmail
};

async function sendOtpToEmail(email){
    try{
    //Generate OTP 
    const otp = otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const now = new Date();
    //const expiration_time = AddMinutesToDate(now,10);
     
   
    //Create OTP instance in DB
    /*const otp_instance = await db.Otp.create({
      otp: otp,
      expirationDate: expiration_time
    });*/

    // Create details object containing the email and otp id
    var details={
        "timestamp": now, 
        "check": email,
        "success": true,
        "message":"OTP sent to user"/*,
        "otp_id": otp_instance.id*/
    }

    // Encrypt the details object    
    const encoded = Buffer.from(JSON.stringify(details)).toString('base64');
        
    var email_subject="[Rate it!]: Email Verification";  

    var templateVars = {
        otpCode: otp
    }

    path.join(__dirname, `../email_templates/email_verification.html`)

    const templatePath = path.join(__dirname, `../email_templates/email_verification.html`);    

    if (fs.existsSync(templatePath)) {
        
        const template = fs.readFileSync(templatePath, "utf-8");
        const html = ejs.render(template, templateVars);
        const text = htmlToText(html);
        const htmlWithStylesInlined = juice(html);    
        
        // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'Gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        },          
        tls: {
            //secureProtocol: "TLSv1_method"
            rejectUnauthorized: false
        }
      });       
  
      const mailOptions = {
        from: `"Rate it! Team"<${process.env.EMAIL_ADDRESS}>`,
        to: `${email}`,
        subject: email_subject,
        html:htmlWithStylesInlined,
        text:text          
      };
  
      await transporter.verify();
      
      //Send Email
      await transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log(err.message);
          throw err.message;
        }
      });

      return encoded;
      }  
    }
    catch(err){
      console.log(err.message);
        throw err.message;
    } 
}