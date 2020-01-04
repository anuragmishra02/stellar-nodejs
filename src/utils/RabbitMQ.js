const amqp = require("amqplib/callback_api");

class RabbitMQ {

    constructor(serverUrl) {        
        this.amqpServer = serverUrl;
        this.producer = null;
        this.consumer = null;
    }

    updateClients(producer, consumer) {
        this.producer = producer;
        this.consumer = consumer;
    }

    async config() {
        return new Promise((resolve, reject) => {
            amqp.connect(this.amqpServer, (err, conn) => {
                if (err) {
                    reject(err);
                }
                else {                    
                    const producer = new Promise((resolve1, reject1) => {                        
                        conn.createChannel((err1, producerChannel) => {                            
                            if (err1) {
                                reject1(err1);
                            }
                            else {
                                resolve1(producerChannel);
                            }
                        });
                    });

                    const consumer = new Promise((resolve2, reject2) => {
                        conn.createChannel((err2, consumerChannel) => {
                            if (err2) {
                                reject2(err2);
                            }
                            else {
                                resolve2(consumerChannel);
                            }
                        });
                    });      
                    Promise.all([producer, consumer])
                        .then((channels) => {
                            this.updateClients(channels[0], channels[1]);
                            resolve(true);
                        })  
                        .catch(reject);            
                }
            });
        });
    }
}

module.exports = RabbitMQ;