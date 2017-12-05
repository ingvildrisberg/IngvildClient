$(document).ready(() => {

  SDK.Student.loadNav();
  const $eventList = $("#event-list");

  SDK.Event.getEvents((err, events) =>      {
    if (err) throw err;
    events.forEach((event))


           books.forEach( (book) => {

               const eventHtml = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${event.eventName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                      <dl>
                        <dt>Location</dt>
                        <dd>${event.location}</dd>
                        <dt>Description</dt>
                        <dd>${event.description}</dd>
                        <dt>Event Date</dt>
                        <dd>${book.eventDate}</dd>
                         <dt>Owner</dt>
                        <dd>${book.owner}</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${event.price}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-success purchase-button" data-event-id="${event.id}">Add to basket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;


             $eventList.append(eventHtml);


           });


             $(".purchase-button").click(function() {
               const idEvent = $(this).data("event-id");
              const event = events.find((event) => event.id === idEvent);
              SDK.Events.addToBasket(event);
              $("#purchase-modal").modal("toggle");
              });


  });

    $("#purchase-modal").on("shown.bs.modal", () => {
      const basket = SDK.Storage.load("basket");
      const $modalTbody = $("#modal-tbody");
      $modalTbody.empty();
      basket.forEach((entry) => {
          const total = entry.event.price * entry.count;

          $modalTbody.append(`
        <tr>
            <td>
            <td>${entry.event.eventName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.event.price}</td>
            <td>kr. ${total}</td>
        </tr>
      `);

    });
    });

});