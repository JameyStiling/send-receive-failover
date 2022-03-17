import pm2 from "pm2";

const disconnectOnError = (err) => {
  if (err) {
    return pm2.disconnect();
  }
};

// This will spawn or connect to local PM2
pm2.connect(async function (err) {
  if (err) {
    console.log("connect error");
    console.error(err);
    process.exit(2);
  }

  // Start Sender Application
  pm2.start(
    {
      script: "dist/sender.js",
      name: "sender",
    },
    disconnectOnError
  );

  // Start Receiver Application
  pm2.start(
    {
      script: "dist/receiver.js",
      name: "receiver",
    },
    disconnectOnError
  );

  // Define Sender Fallback Application
  pm2.start(
    {
      script: "dist/sender.js",
      name: "senderFallback",
    },
    (err, process) => {
      pm2.stop("senderFallback");
      console.log("SenderFallback on stand by");
    }
  );

  // This allow to receive message from process managed with PM2.
  pm2.launchBus(function (err, pm2_bus) {
    pm2_bus.on("process:msg", function (packet) {
      // When error message received by "sender" application ensure the sender app is stopped and then start the fallback
      if (packet.process.name === "sender") {
        pm2.stop("sender", () => {
          console.log("Sender App Stopped");
          pm2.restart(
            {
              script: "dist/sender.js",
              args: `${packet.data.count.toString()} Failover`,
              name: "senderFallback",
            },
            (err, process) => {
              console.log("SenderFallback Running");
            }
          );
        });
      }
    });
  });
});
