var nodemailer = require('nodemailer');
var email = require('../data.js');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email.address,
    pass: email.pw
  }
});

function invite(toEmail, teamName) {
  var subject = 'Invitation to Join ' + teamName + '!';
  var emailBody = 'You have been invited to join ' + teamName + ' on Bridging! Please visit www.Bridging.com, create an account, if you haven\'t already, and login to accept your invitation.';
  var mailOptions = {
    from: '"Bridging" teammatereminder@gmail.com',
    to: toEmail,
    subject: subject,
    text: emailBody,
    html: emailBody
  };
  console.log('attempting to send email invitation:', mailOptions);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return console.log('error sending invitation email', error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

module.exports ={
  invite
};