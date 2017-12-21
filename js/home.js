$(document).ready(() => {
    SDK.Student.loadNav();
    $(".logout-button").click(function(){
        SDK.logOut();
    });
});