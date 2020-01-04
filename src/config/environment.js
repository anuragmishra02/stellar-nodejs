const {
    FBGRAPH_URL, 
    FBGRAPH_VERSION, 
    FBAPP_ID, 
    FBAPP_SECRET, 
    FBAPP_NAME, 
    FBAPP_ACCESSTOKEN,
    //rabbitmq variables
    PORT,
    AMQP,
    QUEUE,
    RESQUEUE
} = process.env;



const fbGraph = {
    fbGrapg_url : FBGRAPH_URL,
    fb_graph_version : FBGRAPH_VERSION,
    fbapp_id : FBAPP_ID,
    fbapp_secret : FBAPP_SECRET,
    fb_app_name : FBAPP_NAME,
    fbapp_accesstoken : FBAPP_ACCESSTOKEN
}

const rabbitMQ = {
    amqp : AMQP,
    queuq : QUEUE,
    resQueue:RESQUEUE
}

const Server = {
    port: PORT,
}

module.exports = {
    fbGraph,
    rabbitMQ,
    Server
};