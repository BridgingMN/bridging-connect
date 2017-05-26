var nodemailer = require('nodemailer');
var email = require('./config.js');
var path = require('path');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email.address,
    pass: email.pw
  }
});

var fromBridgingGmail = '"Bridging" bridgingschedulingapplication@gmail.com'

function invite(toEmail, teamName) {
  var subject = 'Invitation to Join ' + teamName + '!';
  var emailBody = 'You have been invited to join ' + teamName + ' on Bridging! Please visit www.Bridging.com, create an account, if you haven\'t already, and login to accept your invitation.';
  var mailOptions = {
    from: fromBridgingGmail,
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

function resetPassword(toEmail, resetToken) {
  var subject = 'Reset Bridging.org Password';
  var passwordResetLink = 'http://localhost:5000/#/confirmreset/' + resetToken;
  var emailBody = 'A password reset has been initiated for your account. To reset your password, click the following link:\n\n' + passwordResetLink + '\n\n If you did not initiate this password reset you may ignore this e-mail.';

  var mailOptions = {
    from: fromBridgingGmail,
    to: toEmail,
    subject: subject,
    text: emailBody,
    html: emailBody
  };
  console.log('attempting to send email invitation:', mailOptions);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return console.log('error sending password reset link email', error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

function updatedPassword(toEmail, resetToken) {
  var subject = 'Your Bridging Password Has been reset';
  var emailBody = 'Your password for the Bridging Scheduling Application has been reset. If you did not initiate this password reset you should contact an administrator.';

  var mailOptions = {
    from: fromBridgingGmail,
    to: toEmail,
    subject: subject,
    text: emailBody,
    html: emailBody
  };
  console.log('attempting to send email invitation:', mailOptions);
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return console.log('error sending password confirm email', error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

module.exports.resetPassword = resetPassword;
module.exports.updatedPassword = updatedPassword;
