# send-receive-failover
## Part 1

### Create Sender App
- The Sender App logic increments a counter every second (infinitely or until interruption)
- The Sender App sends each count number to the Receiver App
- The Sender App has associated an arbitrary string appID that is sent along each count to the Reciever App
- The Sender App has associated another NodeID that represents the if is the main app or the failover app NodeID

Suggested payload to be sent to the Receiver:
```json=
{
    "count": int, // 0,1,2,3,4 ...
    "appID": string, 
    "nodeID": string
}
```

### Create Receiver App
- The Receiver App logic just receives the payload from the Sender App.
- The Receiver App prints each payload received

## Part 2
### Run/Deploy with Atomic Failover System

Main App == Master App
Failover App == Slave App

In this exercise we would like to build a failover system to maximize application uptime with the following sequence:
- Sender App is running, incrementing counter and sending message to Receiver app
- Receiver App is running and printing the messages
- Sender App is stopped/interrrupted/crashed
- Failover Sender App starts in the count that was left of
- Provide proof that Failover App didn't start before Main App was stopped

And following restrictions:
- **appID** value is the same for both the main and the failover
- **nodeID** value is different for both the main and the failover, think about it as the host identifier
- Failover should be fully automated
- There **cannot** be two instances of the App running at the same time, meaning, there **cannot** be two messages received at the Receiver App with the same count and the same appID but different nodeID.

## Background
This project uses PM2, https://github.com/Unitech/pm2 process manager for node.js application.  PM2 is used here programmatically to provide the sender/receiver failover functionality.
The sender and receiver apps take advantage of web sockets via Socket.IO.
Socket.IO is a library providing full-duplex low-latency web sockets.

## Run

Requirements:
npm, node, PM2

Build Project (this transpiles ts files into js)
```npm run build``` 

Start Project
```npm run pm2```

## Monitor commands
pm2 monit
pm2 logs