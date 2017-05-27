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

var fromBridgingGmail = '"Bridging" bridgingschedulingapplication@gmail.com';

function invite(toEmail, token, token_expiration) {
  console.log('token_expiration', token_expiration);
  var subject = 'Bridging Account Created';
  var activateLink = 'http://localhost:5000/#/confirmreset/' + token;
  var emailBody = 'An account has been created for you on the Bridging scheduling application. To complete activation and setup your password, click the following link: \n\n' + activateLink + ' . \n\n This link will expire on ' + token_expiration.toDateString() + '.';

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

module.exports.invite = invite;
module.exports.resetPassword = resetPassword;
module.exports.updatedPassword = updatedPassword;
