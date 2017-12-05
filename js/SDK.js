const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: options.headers,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(options.data),
      success: (data, status, xhr) => {
        cb(null, data, status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
  Event: {
      findAll: (cb, events) => {

          SDK.request({
              method: "GET",
              url: "/events",
              headers: {
                  Authorization: SDK.Storage.load("token")
              },
                  include: [events]

          }, cb);
    },


      createEvent: (eventName, price, location, eventDate, description, cb) => {
          SDK.request({
                  data: {
                      eventName: eventName,
                      price: price,
                      location: location,
                      eventDate: eventDate,
                      description: description
                  },
                  url: "/events",
                  headers: {
                      Authorization: SDK.Storage.load("token")
                  },
                  method: "POST"
              },
              (err, data) => {

                  if (err) return cb(err);

                  SDK.Storage.persist("crypted", data);

                  cb(null, data);
              })
      },

      getEvents: (cb, events) => {
          SDK.request({
              method: "GET",
              url: "/events",
              headers: {
                  Authorization: SDK.Storage.load("token")
              }
              //cb(null, data);
          }, cb);
      },
      joinEvent: (idEvent, eventName, price, location, eventDate, description, cb) => {
          SDK.request({
              data: {
                  idEvent: idEvent,
                  eventName: eventName,
                  price: price,
                  location: location,
                  eventDate: eventDate,
                  description: description,
              },
              url: "/events/join",
              headers: {
                  Authorization: SDK.Storage.load("token")
              },
              method: "POST"
          }, (err, data) => {

              if (err) return cb(err);
              cb(null, data);
          });
      },

      updateEvent: (idEvent, eventName, price, location, eventDate, description, cb) => {
          SDK.request({
              data: {
                  idEvent: idEvent,
                  eventName: eventName,
                  price: price,
                  location: location,
                  eventDate: eventDate,
                  description: description,
              },
              method: "PUT",
              url: "/events/" + idEvent + "/update-event",
              headers: {
                  Authorization: SDK.Storage.load("token")
              }
          },cb);
      },

      deleteEvent: (idEvent, cb) => {
          SDK.request({
              data: {
                  idEvent: idEvent
              },
              method: "PUT",
              url: "/events/" + idEvent + "/delete-event",
              headers: {
          Authorization: SDK.Storage.load("token"),
              },
          }, (err, data) => {
              if (err) {
                  console.log(idEvent);
                  return cb(err);
              }
              cb(null, data);
          });

      },

      getAttendingStudents: (idEvent, cb) => {
          SDK.request({
              method: "GET",
              url: "/events/" + idEvent + "/students",
              headers: {
                  Authorization: SDK.Storage.load("token")
              }
          },cb);
      },

  },

      Author: {
          findAll: (cb) => {
              SDK.request({method: "GET", url: "/authors"}, cb);
          }
      },
      Order: {
          create: (data, cb) => {
              SDK.request({
                  method: "POST",
                  url: "/orders",
                  data: data,
                  headers: {authorization: SDK.Storage.load("tokenId")}
              }, cb);
          },
          findMine: (cb) => {
              SDK.request({
                  method: "GET",
                  url: "/orders/" + SDK.User.current().id + "/allorders",
                  headers: {
                      authorization: SDK.Storage.load("tokenId")
                  }
              }, cb);
          }
      },
      Student: {
          findAll: (cb) => {
              SDK.request({method: "GET", url: "/staffs"}, cb);
          },
          current: () => {
              return SDK.Storage.load("user");
          },
          login: (email, password, cb) => {
              SDK.request({
                  data: {
                      email: email,
                      password: password
                  },
                  url: "/login",
                  method: "POST"
              }, (err, data) => {

                  //On login-error
                  if (err) return cb(err);

                  SDK.Storage.persist("token", data.token.token);
                  SDK.Storage.persist("user", data);

                  //SDK.Storage.persist("userId", data.userId);
                  //SDK.Storage.persist("user", data.user);

                  cb(null, data);

              });
          },
          create: (firstName, lastName, email, password, verifyPassword, cb) => {
              SDK.request({
                  data: {
                      firstName: firstName,
                      lastName: lastName,
                      email: email,
                      password: password,
                      verifyPassword: verifyPassword
                  },
                  url: "/register",
                  method: "POST"
              }, (err, data) => {

                  if (err) return cb(err);


                  cb(null, data);
              });
          },
          getAttendingEvents: (cb) => {
              SDK.request({
                  method: "GET",
                  url: "/students/" + SDK.Storage.load("user").idStudent + "/events",
                  headers: {
                      Authorization: SDK.Storage.load("token")
                  }


              }, cb);
          },
          loadNav: (cb) => {
              $("#nav-container").load("nav.html", () => {
                  const currentUser = SDK.Student.current();
                  if (currentUser) {
                      $(".navbar-right").html(`
            <li><a href="my-page.html">Your orders</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                  } else {
                      $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                  }
                  $("#logout-link").click(() => SDK.Student.logOut());
                  cb && cb();
              });
          }
      },
      logOut: (cb) => {
          SDK.request({
              url: "/students/logout",
              method: "POST",
              headers: {
                  Authorization: SDK.Storage.load("token")
              }

          }, (err, data) => {
              if (err) return cb(err);

              cb(null, data);
          });

          SDK.Storage.remove("token");
          SDK.Storage.remove("user");
          window.location.href = "index.html";

      },
      Storage: {
          prefix: "BookStoreSDK",
          persist: (key, value) => {
              window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
          },
          load: (key) => {
              const val = window.localStorage.getItem(SDK.Storage.prefix + key);
              try {
                  return JSON.parse(val);
              }
              catch (e) {
                  return val;
              }
          },
          remove: (key) => {
              window.localStorage.removeItem(SDK.Storage.prefix + key);
          }
      }

};


