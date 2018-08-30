// Acquire form from the DOM and prevent auto-refresh of page upon submission
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
});

// Show contact form when "Leave a message" is clicked
function showForm() {
  contactForm.style.display = "block";
}

// Hide contact form when [X]Close is selected
function hideForm() {
  contactForm.style.display = "none";
}

// Create booleans that will act as "valves" for the form submission process; default to false
let allowSubmission = false;
let realnameValidation = false;
let emailValidation = false;
let phoneValidation = false;
let subjectValidation = false;
let commentsValidation = false;

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
const formMessage = document.getElementById("formMessage");

// Get elements which contain our character counters
const subjectLength = document.getElementById("subjectLength");
const commentLength = document.getElementById("commentsLength");

// Define initial character counters
subjectLength.innerHTML = ("(0/100)");
commentsLength.innerHTML = ("(0/1000)");

// Add event listeners for input elements; remove any message if input contents are removed; track remaining characters

realname.addEventListener("input", event => {
  if (!realname.value) {
    realnameMessage.innerHTML = "";
    console.log("Name input erased.");
  }
});

email.addEventListener("input", event => {
  if (!email.value) {
    emailMessage.innerHTML = "";
    console.log("Email address input erased.");
  }
});

phone.addEventListener("input", event => {
  if (!phone.value) {
    phoneMessage.innerHTML = "";
    console.log("Phone number input erased.");
  }
});

subject.addEventListener("input", event => {
  if (!subject.value) {
    subjectMessage.innerHTML = "";
    console.log("Subject input erased.");
    subjectLength.innerHTML = ("(0/100)");
  } else {
    subjectLength.innerHTML = ("(" + subject.value.length + "/100)");
    // Add logic: if within 10% of total characters, change color of counter to red
  }
});

comments.addEventListener("input", event => {
  if (!comments.value) {
    commentsMessage.innerHTML = "";
    console.log("Comments input erased.");
    commentsLength.innerHTML = ("(0/1000)");
  } else {
    commentsLength.innerHTML = ("(" + comments.value.length + "/1000)");
    // Add logic: if within 10% of total characters, change color of counter to red
  }
});

// Success message - might be a string of text or an icon
const successMessage = "Looks good!";

// Validation for name; tests for special characters and determines if actual (non-empty) data entry has occurred.
function checkName() {
  const nonWordPattern = RegExp("[^a-zA-Z \-]+"); // Regular expression: the string includes a character that is not a letter, space, or dash
  if (checkEmptyEntry(realname.value)) {
    realnameValidation = false;
    console.log("Name field is empty.");
    realnameMessage.innerHTML = "Please enter your name.";
  } else if (nonWordPattern.test(realname.value)) {
    realnameValidation = false;
    console.log("Name contains special characters; form will not be submitted.");
    realnameMessage.innerHTML = "Please remove special characters from this field.";
  } else {
    realnameValidation = true;
    console.log("Name passes validation.");
    realnameMessage.innerHTML = successMessage; 
  }
}

// Validation for email address; uses built-in HTML5 validity functionality (not perfect but will suffice for our purposes)
// If checking validity from scratch, theoretically would look for a pattern of [string] + "@" + [string] + "." + [string]
// A wide array of possible characters exist, so doing this from scratch is more trouble than it's worth:
// [Wikipedia Article](https://en.wikipedia.org/wiki/Email_address)
function checkEmail() {
  if (checkEmptyEntry(email.value)) {
    emailValidation = false;
    console.log("Email field is empty.");
    emailMessage.innerHTML = "Please enter your email address.";
  } else if (!email.validity.valid) {
    emailValidation = false;
    console.log("Email address appears to be invalid.");
    emailMessage.innerHTML = "Please enter a valid email address.";
  } else {
    emailValidation = true;
    console.log("Email address passes validation.");
    emailMessage.innerHTML = successMessage;
  }
}

// Validation for phone number; max length of ten characters is controlled by HTML (but we'll test for this anyway)
// Phone number should be all numbers with a total of 10 numerals
function checkPhone() {
  const nonDigitPattern = RegExp("[^0-9]"); // Regular expression: a non-digit character (not 0-9)
  if (phone.value.length !== 10) {
    phoneValidation = false;
    console.log("Phone number is not ten characters.");
    phoneMessage.innerHTML = "Phone number should be ten total characters (example: 6162586179).";
  } else if (nonDigitPattern.test(phone.value)) {
      phoneValidation = false;
      console.log("Phone number includes non-numerical characters.");
      phoneMessage.innerHTML = "Please use numbers only.";
  } else {
    phoneValidation = true;
    console.log("Phone number passes validation.");
    phoneMessage.innerHTML = successMessage;
  }
}

// Validation for subject; tests to see if if actual (non-empty) data entry has occurred.
function checkSubject() {
  if (checkEmptyEntry(subject.value)) {
    subjectValidation = false;
    console.log("Subject field is empty.");
    subjectMessage.innerHTML = "Please enter a subject.";  
  } else {
    subjectValidation = true;
    console.log("Subject passes validation.");
    subjectMessage.innerHTML = successMessage; 
  }
}

// Validation for message comments; tests to see if if actual (non-empty) data entry has occurred.
function checkComments() {
  if (checkEmptyEntry(comments.value)) {
    commentsValidation = false;
    console.log("Comments field is empty.");
    commentsMessage.innerHTML = "Please enter a message.";  
  } else {
    commentsValidation = true;
    console.log("Comments pass validation.");
    commentsMessage.innerHTML = successMessage; 
  }
}

// Trim white space from beginning of text input; if the input is null after trimming, return true (ie, "yes, it's empty"); otherwise return false
function checkEmptyEntry(string) {
  const leadingSpaces = RegExp("^\s+"); // Regular expression: all spaces and similar characters at the beginning of the string prior to the first "real" character
  string.replace(leadingSpaces, "");
  if (string.length === 0) {
    return true;
  } else {
    return false;
  }
}

// Check all input validation values; if all are true, set allowSubmission to true
function checkInputValidation () {
  console.log("Name validation: " + realnameValidation);
  console.log("Email validation: " + emailValidation);
  console.log("Phone number validation: " + phoneValidation);
  console.log("Subject validation: " + subjectValidation);
  console.log("Comments validation: " + commentsValidation);
  if ( realnameValidation && emailValidation && phoneValidation && subjectValidation && commentsValidation ) {
    allowSubmission = true;
    console.log("All fields pass validation.");
  }
}

// Form submission script
function submitForm() {

  // This form can be submitted simply by hitting enter within certain fields.
  // Therefore we will perform all checks upon submission to display errors (or re-validate the currently selected field).

  checkName();
  checkEmail();
  checkPhone();
  checkSubject();
  checkComments();

  const recipient = "contact@slotherks.com"; // Recipient of message from website
  const printConfig = "email,subject"; // Include the visitor email and subject in the response from the script
  const printBlankFields = "1"; // Include blank fields in the response from the script (shouldn't happen if all fields are required)

  // const secretfield = document.getElementById("secretfield").value; // If not using reCAPTCHA
  // const successfulSubmissionRedirect = document.getElementById("successfulSubmissionRedirect").value;
  // const missingFieldsRedirect = document.getElementById("missingFieldsRedirect").value;

  const secretCode = "1234"; // This is the required code necessary for form submission, defined in the file formmail.code

  /* 
  
  We should sanitize the user input on the contact form.  We can do this in several ways:
  1) check to make sure the input is in the correct format as the user types in real time,
  2) check the input when the user moves away from the field, or
  3) run a check on the input when the submit button is clicked.

  For each input, we should expect to see the following:
  * NAME: A string of text.  If we wanted to be picky, this field would not include special characters.
  * EMAIL:  Another string of text, with the syntax [string] + "@" + [string] + "." + [string].
  * PHONE:  A string with an expected length of 10 that consists of all numbers.
  * SUBJECT:  String of text, allowing for special characters.  Stretch goal:  limit the number of characters and display the remaining characters in real time?
  * MESSAGE:  String of text, allowing for special characters.  Stretch goal:  Maybe limit the number of characters and display the remaining characters in real time?
  
  */

  // allowSubmission must be set to "true" for the form to be submitted.  This can only occur when all fields have been filled out successfully.

  checkInputValidation();

  if (allowSubmission) {

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
    //   formMessage.innerHTML = "Code incorrect; please re-enter.";
    // } else {
    //   console.log("Secret code correctly entered.");
    //   console.log(formData);
    //   sendData(formData, formMessage);
    // }

    if (recaptchaResponse !== "" ) {
      console.log("Google reCAPTCHA response received.");
      console.log(recaptchaResponse);
      console.log("Here is the form data...");
      console.log(formData);
      sendData(formData, formMessage);
    } else {
      console.log("No reCAPTCHA; form will not be submitted.");
      formMessage.innerHTML = "Please verify your humanity with reCAPTCHA before submitting the form.";
    }

  } else {
    console.log("All fields do not yet pass validation.");
    // Rather than use the line below, we are running checks on all fields upon submission.
    // This will result in errors popping up appropriately per input field.
    // formMessage.innerHTML = "Please verify all fields are filled out correctly before submitting.";
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
    formMessage.innerHTML = "Message sent!";
  });

  // Define what happens in case of error
  XHR.addEventListener('error', function(event) {
    // alert('Oops! Something goes wrong.');
    formMessage.innerHTML = "An error occurred; message not sent.  Try again?";
  });

  // Set up our request
  XHR.open('POST', 'https://www.slothwerks.com/cgi-bin/FormMail.pl');

  // Add the required HTTP header for form data POST requests
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Finally, send our data.
  console.log(urlEncodedData);
  XHR.send(urlEncodedData);
}
