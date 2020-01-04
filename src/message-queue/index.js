const RabbitMQ = require("../utils/RabbitMQ");
const { RabbitMQ: { queueNames, server } } = require("../config/project-env");

class AMQPStellar extends RabbitMQ {

    request(requestName, action) {
        switch (requestName) {
            case "createAccount":
                this.createAccount(action);
                break;
            default:
                console.log("Provided request name does not match with the existing services");
                break;
        }
    }

    createAccount(action) {
        console.log("Rabbit mq_ createaccount");
        this.consumer.assertQueue(queueNames.req.createAccount, { durable: true });
        this.consumer.consume(queueNames.req.createAccount, async (msg) => {
            this.consumer.ack(msg);
            console.log(msg.properties.correlationId);
            const result = await action();
            console.log(result);
            this.producer.assertQueue(queueNames.res.createAccount, { durable: true });
            this.producer.sendToQueue(queueNames.res.createAccount, Buffer.from(JSON.stringify(result)), { correlationId: msg.properties.correlationId });
        });
    }

    requestFreeTokens(action) {
        console.log("Rabbit mq_ freetokens");
        this.consumer.assertQueue(queueNames.req.freeTokens, { durable: true });
        this.consumer.consume(queueNames.req.freeTokens, (msg) => {
            this.consumer.ack(msg);
            console.log(msg.properties.correlationId);
            const data = JSON.parse(msg.content.toString());

            action(data).then((val) => {
                console.log(data);
                this.producer.assertQueue(queueNames.res.freeTokens, { durable: true });
                this.producer.sendToQueue(queueNames.res.freeTokens, Buffer.from(JSON.stringify(val)), { correlationId: msg.properties.correlationId });
            });
        });
    }
}

const amqpStellar = new AMQPStellar("amqp://localhost");

module.exports = amqpStellar;