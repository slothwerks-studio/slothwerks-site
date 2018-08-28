// Acquire form from the DOM and prevent auto-refresh of page upon submission
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
});

// Create a boolean that will stop the form submission process
let allowSubmission = true;

// Fetch form elements from the DOM
const realname = document.getElementById("realname"); // Please use "realname" convention; this is important for correct submission to the FormMail script.
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const comments = document.getElementById("comments");

// Get elements which will contain our messages
const realnameMessage = document.getElementById("realnameMessage");
const emailMessage = document.getElementById("emailMessage");
const phoneMessage = document.getElementById("phoneMessage");
const subjectMessage = document.getElementById("subjectMessage");
const commentsMessage = document.getElementById("commentsMessage");

// Add event listeners for message elements; remove message if input contents are removed

email.addEventListener("input", event => {
  if (!email.value) {
    emailMessage.innerHTML = "";
  }
});

phone.addEventListener("input", event => {
  if (!email.value) {
    phoneMessage.innerHTML = "";
  }
});

// Validation for name; basically tests to see if data entry of some kind has occurred.
// NOTE: Perhaps for names specifically we should also check for special characters such as */\[]{}<>; et cetera
function checkRealName() {

}

// Validation for subject; basically tests to see if data entry of some kind has occurred.
function checkSubject() {

}

// Validation for message content; basically tests to see if data entry of some kind has occurred.
function checkMessage() {

}

// Validation for email address; uses built-in validity functionality (not perfect but will suffice for our purposes)
function checkEmail() {
  if (email.validity.valid) {
    allowSubmission = true;
    emailMessage.innerHTML = "Looks good!";
  } else {
    allowSubmission = false;
    emailMessage.innerHTML = "This email appears invalid; please re-enter.";
  }
}

// Validation for phone number; max length of ten characters is controlled by HTML (but we'll test for this anyway)
// Phone number should be all numbers with a total of 10 numerals
function checkPhone() {
  let phonePattern = RegExp("\d{10}");
  if ( (phone.value.length === 10) && (phonePattern.test(phone.value)) ) {
    allowSubmission = true;
    phoneMessage.innerHTML = "Looks good!";
  } else {
    allowSubmission = false;
    phoneMessage.innerHTML = "Please use numbers only; include area code.";
  }
}

// Trim white space from beginning of text input; if the input is null after trimming, return false; otherwise return true
function checkDataEntry(string) {
  let emptyLeadingSpaces = RegExp("^\s+");
  string.replace(emptyLeadingSpaces, "");
  if (string.length === 0) {
    return false;
  } else {
    return true;
  }
}





// Form submission script
function submitForm() {

  const recipient = "contact@slotherks.com"; // Recipient of message from website
  const printConfig = "email,subject"; // Include the visitor email and subject in the response from the script
  const printBlankFields = "1"; // Include blank fields in the response from the script (shouldn't happen if all fields are required)

  // const secretfield = document.getElementById("secretfield").value; // If not using reCAPTCHA
  // const successfulSubmissionRedirect = document.getElementById("successfulSubmissionRedirect").value;
  // const missingFieldsRedirect = document.getElementById("missingFieldsRedirect").value;

  const secretCode = "1234"; // This is the required code necessary for form submission, defined in the file formmail.code

  /* We should sanitize the user input on the contact form.  We can do this in two ways:
  1) check to make sure the phone number is in the correct format as rhe user types in real time, and
  2) possibly run a check on the input once received.

  For each input, we should expect to see the following:
  NAME: A string of text.  If we wanted to be picky, this field would not include special characters.
  EMAIL:  Another string of text, with the syntax [string] + "@" + [string] + "." + [string].
  PHONE:  A string that could theoretically be converted to a 1-digit whole number.
  SUBJECT:  String of text, allowing for special characters.  Maybe limit the number of characters and display the remaining characters in real time?
  MESSAGE:  String of text, allowing for special characters.  Maybe limit the number of characters and display the remaining characters in real time?
  */

  // We assume our JavaScript has completed validation.  But this assumes the user has touched the inout fields.
  // If the user has not done anything and simply clicks submit, we'll want to generate some errors.

  const recaptchaResponse = grecaptcha.getResponse(); // Verifies humanity based on reCAPTCHA widget

  const formData = {
    recipient: recipient,
    print_config: printConfig,
    print_blank_fields: printBlankFields,
    realname: realname.value,
    email: email.value,
    phone: phone.value,
    subject: subject.value,
    comments: comments.value,
    // secretfield: secretfield // If not using reCAPTCHA
  }

  // The following was the original code used for FormMail's "secretfield"...

  // if (secretfield !== secretCode) { // Security check
  //   console.log("Secret code incorrect.");
  //   document.getElementById("formMessage").innerHTML = "Code incorrect; please re-enter.";
  // } else {
  //   console.log("Secret code correctly entered.");
  //   console.log(formData);
  //   sendData(formData, formMessage);
  // }

  if (recaptchaResponse !== "" ) {
    console.log("Google ReCaptcha response received.");
    console.log(recaptchaResponse);
    console.log("Here is the form data...")
    console.log(formData);
    sendData(formData, formMessage);
  } else {
    console.log("No reCAPTCHA; form will not be submitted.")
    document.getElementById("formMessage").innerHTML = "Please verify your humanity before submitting the form.";
  }

}

function sendData(data, message) {
  let XHR = new XMLHttpRequest();
  let urlEncodedData = "";
  let urlEncodedDataPairs = [];
  let name;

  // Turn the data object into an array of URL-encoded key/value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  // Combine the pairs into a single string and replace all %-encoded spaces to
  // the '+' character; matches the behavior of browser form submissions.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  // Define what happens on successful data submission
  XHR.addEventListener('load', function(event) {
    // alert('Yeah! Data sent and response loaded.');
    document.getElementById("formMessage").innerHTML = "Message sent!";
  });

  // Define what happens in case of error
  XHR.addEventListener('error', function(event) {
    // alert('Oops! Something goes wrong.');
    document.getElementById("formMessage").innerHTML = "An error occurred; message not sent.  Try again?";
  });

  // Set up our request
  XHR.open('POST', 'https://www.slothwerks.com/cgi-bin/FormMail.pl');

  // Add the required HTTP header for form data POST requests
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Finally, send our data.
  console.log(urlEncodedData);
  XHR.send(urlEncodedData);
}
