$(document).ready(() => {

    SDK.Student.loadNav();
    $("#create-event-button").click(() => {

        const eventName = $("#inputEventName").val();
        const price = $("#inputPrice").val();
        const location = $("#inputLocation").val();
        const eventDate = $("#inputEventDate").val();
        const description = $("#inputDescription").val();

        SDK.Event.createEvent(eventName, price, location, eventDate, description, (err, data) => {
            if (err && err.xhr.status !== 200) {
                console.log("FEIL")
            }
            else {
                console.log("Event Created")
                window.location.href = "all-events.html";
            }
        });

    });

});