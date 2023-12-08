const Imap = require("node-imap");
const inspect = require("util").inspect;
const { secret } = require("./secret");
function fetchLatestEmail() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: secret.imap_user,
      password: secret.imap_password,
      host: secret.imap_host,
      port: secret.imap_port,
      tls: secret.imap_tls,
    });

    function openInbox(cb) {
      imap.openBox("INBOX", true, cb);
    }

    imap.once("ready", function () {
      openInbox(function (err, box) {
        if (err) {
          reject(err);
          return;
        }

        const f = imap.seq.fetch(box.messages.total + ":*", {
          bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
        });

        let emailDetails = {};

        f.on("message", function (msg, seqno) {
          console.log("Message #%d", seqno);
          const prefix = "(#" + seqno + ") ";

          msg.on("body", function (stream, info) {
            let buffer = "";
            stream.on("data", function (chunk) {
              buffer += chunk.toString("utf8");
            });

            stream.once("end", function () {
              if (info.which === "TEXT") {
                console.log(prefix + "Body:");
                console.log(buffer);

                // Store email body in emailDetails
                emailDetails.body = buffer;
              } else {
                const parsedHeader = Imap.parseHeader(buffer);

                console.log(prefix + "Parsed header:", parsedHeader);

                // Store header details in emailDetails
                emailDetails.header = parsedHeader;
              }
            });
          });

          msg.once("attributes", function (attrs) {
            console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));

            // Store attribute details in emailDetails
            emailDetails.attributes = inspect(attrs, false, 8);
          });

          msg.once("end", function () {
            resolve(emailDetails);
          });
        });

        f.once("error", function (err) {
          console.log("Fetch error: " + err);
          reject(err);
        });

        f.once("end", function () {
          console.log("Done fetching all messages!");
          imap.end();
        });
      });
    });

    imap.once("error", function (err) {
      console.log(err);
      reject(err);
    });

    imap.once("end", function () {
      console.log("Connection ended");
    });

    imap.connect();
  });
}

module.exports = { fetchLatestEmail };
