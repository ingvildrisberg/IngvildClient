$(document).ready(() => {

  SDK.Student.loadNav();

  $("#login-button").click(() => {

    const email = $("#inputEmail").val();
    const password = $("#inputPassword").val();

    SDK.Student.login(email, password, (err, data) => {
      if (err && err.xhr.status === 401) {
        $(".form-group").addClass("has-error");
      }
      else if (err){
          window.alert("Can not log in. Make sure username and password is correct.");
        console.log("Something went wrong, please try again")
      } else {
        window.location.href = "home.html";
      }
    });

  });

  $("#GOTO-create-button").click(() => {
    window.location.href = "create-user.html";
  });

});