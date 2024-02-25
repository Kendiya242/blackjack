console.log(mdc);

const MDCTopAppBar = mdc.topAppBar.MDCTopAppBar;
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
const topAppBar = new MDCTopAppBar(topAppBarElement);

const MDCTextField = mdc.textField.MDCTextField;
const foos = [].map.call(
  document.querySelectorAll(".mdc-text-field"),
  function (el) {
    return new MDCTextField(el);
  }
);
