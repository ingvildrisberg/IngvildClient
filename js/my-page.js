$(document).ready(() => {

    SDK.Student.loadNav();

    const $joinEventsTable = $("#joinedEventsTable");
    const $ownEventsTable = $("#ownEventsTable");
    const currentUser = SDK.Storage.load("user");



        SDK.Student.getAttendingEvents((err, events) => {
            if(err) throw err;
            if(events != null) {
                events = JSON.parse(events);
            }
            console.log(events);
            events.forEach((event) => {
                console.log(event);

                let eventHtml = `
          
    <tr>
            
        <td>${event.eventName}</td>
        <td>${event.price}</td>
        <td>${event.location}</td>
        <td>${event.eventDate}</td>
        <td>${event.description}</td>
        
        </tr> 
        `;

                $joinEventsTable.append(eventHtml);

            });
        });

        SDK.Event.findAll((err, events) => {
            if(events != null) {
                events = JSON.parse(events);
            }
            if (err) throw err;
            events.forEach((event) => {
                console.log(event);
            if (currentUser.idStudent === event.owner) {
                let eventHtml = `
                <tr>
                <td>${event.eventName}</td>
                <td>${event.price}</td>
                <td>${event.location}</td>
                <td>${event.eventDate}</td>
                <td>${event.description}</td>
            
                <td><button class="btn-sm btn-primary editEventButton" data-toggle="modal" data-target="#editEventModal" data-event-id="${event.idEvent}">Edit</button></td>
                <td><button class="btn-sm btn-danger deleteEventButton" data-event-id="${event.idEvent}">Delete</button></td>
                </tr>
                `;

                $ownEventsTable.append(eventHtml);

            }


            });
            $(".deleteEventButton").click(function () {

                const idEvent = $(this).data("event-id");
                console.log(idEvent);
                const event = events.find((event) => event.idEvent === idEvent);

                SDK.Event.deleteEvent(event.idEvent, (err, data) => {
                    if (err && err.xhr.status === 401){
                        $(".from-group").addClass("has-error")
                    }
                    else if (err) {
                        console.log("An error has happened");
                        window.alert("There was an error deleting the event");
                    } else {
                        window.location.reload();
                    }
                })
            });

            $(".editEventButton").click(function () {

                const idEvent = $(this).data("event-id");
                const event = events.find((event) => event.idEvent === idEvent);
                console.log(idEvent);

                $("#inputEventName").val(event.eventName);
                $("#inputPrice").val(event.price);
                $("#inputLocation").val(event.location);
                $("#inputEventDate").val(event.eventDate);
                $("#inputDescription").val(event.description);

                $("#eventEditSubmitButton").click(() => {
                    const eventName = $("#inputEventName").val();
                    const price = $("#inputPrice").val();
                    const location = $("#inputLocation").val();
                    const eventDate = $("#inputEventDate").val();
                    const description = $("#inputDescription").val();

                console.log(eventName);

                SDK.Event.updateEvent (idEvent, eventName, price, location, eventDate, description, (err, data) => {
                    if (err && err.xhr.status === 401) {
                        $(".from-group").addClass("has-error")
                    }
                    else if (err) {
                        console.log("An error happened")
                        window.alert("Can not update event");
                    } else {
                        window.location.reload();
                    }


                })
                });




            });



        });


});


