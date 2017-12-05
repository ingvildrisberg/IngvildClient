$(document).ready(() => {

    SDK.Student.loadNav();

    $("#create-button").click(() => {

        const firstname = $("#inputFirstname").val();
        const lastname = $("#inputLastname").val();
        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();
        const verifyPassword = $("#inputVerifyPassword").val();

        SDK.Student.create(firstname, lastname, email, password, verifyPassword, (err, data) => {
            if (err && err.xhr.status !== 200) {
                $(".form-group").addClass("has-error");
                console.log("FEIL")
            } else {
                console.log("User created");
                window.alert("You have now created a user. Please log in.");
                window.location.href = "index.html";
            }
        });

    })

});