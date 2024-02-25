const MDCTextField = mdc.textField.MDCTextField;
const textFields = [].map.call(
  document.querySelectorAll(".mdc-text-field"),
  function (el) {
    return new MDCTextField(el);
  }
);

const MDCCheckbox = mdc.checkbox.MDCCheckbox;
const checkboxes = [].map.call(
  document.querySelectorAll(".mdc-checkbox"),
  function (el) {
    return new MDCCheckbox(el);
  }
);
console.log(document.forms[0]);
const myForm = document.forms[0];
const signUpButton = myForm[8];
const [
  fullNameInput,
  usernameInput,
  enterPasswordInput,
  confirmPasswordInput,
  ageInput,
  birthDateInput,
  legalCheckbox,
  termsCheckbox,
] = myForm;
console.dir(signUpButton);
function validateEligibility(event) {
  event.preventDefault();
  //extract the current values
  const fullNameValue = fullNameInput.value;
  const usernameValue = usernameInput.value;
  const enterPasswordValue = enterPasswordInput.value;
  const confirmPasswordValue = confirmPasswordInput.value;
  const ageValue = ageInput.value;
  const birthDateValue = birthDateInput.value;
  const legalValue = legalCheckbox.checked;
  const termsValue = termsCheckbox.checked;
  console.log(legalValue, termsValue);
  //log current values
  console.log(`Full Name: ${fullNameValue}`);
  console.log(`Username: ${usernameValue}`);
  console.log(`Enter Password: ${enterPasswordValue}`);
  console.log(`Confirm Password: ${confirmPasswordValue}`);
  console.log(`Age: ${ageValue}`);
  console.log(`Birth Date: ${birthDateValue}`);
  //log checkbox values
  if (legalValue) {
    console.log("The user has checked the legal checkbox");
  } else {
    console.log("The user has not checked the legal checkbox");
  }
  if (termsValue) {
    console.log("The user has checked the terms checkbox");
  } else {
    console.log("The user has not checked the terms checkbox");
  }
  //all validations
  const bothCheckboxes = legalValue && termsValue;
  const isOfAge = ageValue >= 13;
  function isNotEmpty(str) {
    return str !== "";
  }
  const noEmptyFields =
    isNotEmpty(fullNameValue) &&
    isNotEmpty(usernameValue) &&
    isNotEmpty(enterPasswordValue) &&
    isNotEmpty(confirmPasswordValue) &&
    isNotEmpty(ageValue) &&
    isNotEmpty(birthDateValue);
  const passwordsMatch = enterPasswordValue === confirmPasswordValue;
  if (passwordsMatch && bothCheckboxes && isOfAge && noEmptyFields) {
    console.log("The user is eligible");
  } else {
    console.log("The user is ineligible");
  }
}
signUpButton.addEventListener("click", validateEligibility);
