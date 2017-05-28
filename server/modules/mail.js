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

function invite(caseworkerObject, token, token_expiration) {
  console.log('caseworkerObject', caseworkerObject);
  console.log('token_expiration', token_expiration);
  var toEmail = caseworkerObject.email;
  var subject = 'Bridging Account Created';
  var activateLink = 'http://localhost:5000/#/updatepassword/' + token + '/' + toEmail + '/activate';
  var emailBody = 'An account has been created for you on the Bridging scheduling application. To complete activation and setup your password, click the following link: \n\n' + activateLink + ' . \n\n This link will expire on ' + token_expiration.toDateString() + '.';
  var emailHTML = '<p>An account has been created for you on the Bridging scheduling application. <strong> Please verify the information below is accurate and activate your account using the link provided.</strong></p>'+
  '<table>' +
  '<tr> <td>First Name</td><td>' + caseworkerObject.first + '</td></tr>' +
  '<tr> <td>Last Name</td><td>' + caseworkerObject.last + '</td></tr>' +
  '<tr> <td>Day Phone</td><td>' + caseworkerObject.day_phone + ' ext ' + caseworkerObject.ext + '</td></tr>' +
  '</table>' +
  '<p>To complete activation and setup your password, click the following link:</p>' +
  '<p><a href="' + activateLink + '"> Activate</a></p> . \n\n <p>This link will expire on ' + token_expiration.toDateString() + '.</p>';

  var mailOptions = {
    from: fromBridgingGmail,
    to: toEmail,
    subject: subject,
    text: emailBody,
    html: emailHTML
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
  var passwordResetLink = 'http://localhost:5000/#/updatepassword/' + resetToken + '/' + toEmail + '/updatedPassword' ;
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

function updatedPassword(toEmail) {
  var subject = 'Your Bridging Password Has Been Updated';
  var emailBody = 'Your password for the Bridging Scheduling Application has been update. If you did not initiate this password change you should contact an administrator.';

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

function activate(toEmail) {
  var subject = 'Your Bridging Account Has Been Activated';
  var emailBody = 'Your account for the Bridging Scheduling Application has been activated.';

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
module.exports.activate = activate;
module.exports.resetPassword = resetPassword;
module.exports.updatedPassword = updatedPassword;
