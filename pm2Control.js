import pm2 from "pm2";

const disconnectOnError = (err) => {
  if (err) {
    return pm2.disconnect();
  }
};

pm2.connect(async function (err) {
  if (err) {
    console.log("connect error");
    console.error(err);
    process.exit(2);
  }

  pm2.start(
    {
      script: "dist/sender.js",
      name: "sender",
    },
    disconnectOnError
  );

  pm2.start(
    {
      script: "dist/receiver.js",
      name: "receiver",
    },
    disconnectOnError
  );

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

  pm2.launchBus(function (err, pm2_bus) {
    pm2_bus.on("process:msg", function (packet) {
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
