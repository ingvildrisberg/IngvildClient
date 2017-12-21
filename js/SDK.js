const SDK = {
  serverURL: "http://localhost:8080/api",
  request: (options, cb) => {

    $.ajax({
      url: SDK.serverURL + options.url,
      method: options.method,
      headers: options.headers,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(SDK.Encryption.encrypt(JSON.stringify(options.data))),
      success: (data, status, xhr) => {
        cb(null, SDK.Encryption.decrypt(data), status, xhr);
      },
      error: (xhr, status, errorThrown) => {
        cb({xhr: xhr, status: status, error: errorThrown});
      }
    });

  },
    //This class makes it possible to pass data to the server side

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

      Student: {
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

                  SDK.Storage.persist("token", JSON.parse(data));
                  SDK.Storage.persist("user", data);


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
          //Method for loading Nav bar and controlling if it should show log in or log out
          loadNav: (cb) => {
              $("#nav-container").load("nav.html", () => {
                  const currentUser = SDK.Student.current();
                  if (currentUser) {
                      $(".navbar-right").html(`
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
                  } else {
                      $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
                  }
                  //Removes token and student id from localstorage when log out button is clicked
                  $("#logout-link").click(function() {
                      SDK.logOut((err, data) => {
                          if (err && err.xhr.staus === 401) {
                              $(".form-group").addClass("has-error");
                          } else {
                              localStorage.removeItem("token");
                              localStorage.removeItem("idStudent");
                              window.location.href = "index.html";
                          }
                      });
                  });
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
    //Method for storing token, id etc.
      Storage: {
          prefix: "",
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
      },

     Encryption: {

//For encrypting data sent from client to server

         encrypt: (encrypt) => {
          if (encrypt !== undefined && encrypt.length !== 0) {
              const fields = ['J', 'M', 'F'];
              let encrypted = '';
              for (let i = 0; i < encrypt.length; i++) {
                  encrypted += (String.fromCharCode((encrypt.charAt(i)).charCodeAt(0) ^(fields[i % fields.length]).charCodeAt(0)))
              }
              return encrypted;
          } else {
              return encrypt;
          }
      },

      //For decrypting data recived from serverside

          decrypt: (decrypt) => {
          if (decrypt.length > 0 && decrypt !== undefined) {
              const fields = ['J', 'M', 'F'];
              let decrypted = '';
              for (let i = 0; i < decrypt.length; i++) {
                  decrypted += (String.fromCharCode((decrypt.charAt(i)).charCodeAt(0) ^(fields [i % fields.length]).charCodeAt(0)))
              }
              return decrypted;
          } else {
              return decrypt;
          }
          }
      },


};


