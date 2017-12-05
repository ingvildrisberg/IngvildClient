$(document).ready(() => {

    const $eventList = $("#event-list");
    SDK.Student.loadNav();

    const $seeAttendingStudents = $("#seeAttendingStudents");

    SDK.Event.getEvents((err, events) => {
        events = JSON.parse(events);
        console.log(events);
        if (err) throw err;
        events.forEach((event) => {

            const eventHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${event.eventName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-8">
                      <dl>
                        <dt>Date</dt>
                        <dd>${event.eventDate}</dd>
                        <dt>Location</dt>
                        <dd>${event.location}</dd>
                        <dt>Description</dt>
                        <dd>${event.description}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${event.price}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn-sm btn-primary seeAttendingStudents" data-event-id="${event.idEvent}"
                            data-toggle="modal" data-target="#attendingStudentsModal">See attendece</button>
                              
                            <button class="btn btn-success joinEventButton" data-event-id="${event.idEvent}">Add to my events</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

            $eventList.append(eventHtml);
        });

        $(".joinEventButton").click(function(){

            const idEvent = $(this).data("event-id");
            const choosenEvent = events.find((event) => event.idEvent === idEvent);

            console.log(idEvent);
            console.log(choosenEvent);

            SDK.Event.joinEvent(choosenEvent.idEvent, choosenEvent.eventName, choosenEvent.price, choosenEvent.location, choosenEvent.eventDate, choosenEvent.description, (err, data) => {
                if (err && err.xhr.status === 401) {
                    $(".form-group").addClass("has-error")
                }
                else if (err){
                    console.log("An error has accoured")
                    window.alert("An error has accoured");
                } else {
                    window.location.reload();
                }
            });

            });

        $(".seeAttendingStudents").click(function () {
            var idEvent = $(this).data("event-id");
            console.log(idEvent);

            SDK.Event.getAttendingStudents(idEvent, (err, students) => {
                if(students != null){
                    students = JSON.parse(students);
                    students.forEach((student) => {
                        console.log(student.firstName);

                        const attendingStudentsHtml = `
                        <p>${student.firstName} ${student.lastName}</p>
                        `;
                        $seeAttendingStudents.empty();
                        $seeAttendingStudents.append(attendingStudentsHtml);
                    });
                } else {
                    $("#seeAttendingStudents").html("No one is attending or an error has occured");
                }
            });

        });


});
});