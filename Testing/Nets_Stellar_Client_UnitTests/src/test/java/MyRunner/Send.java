package MyRunner;

import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.AMQP.BasicProperties;

public class Send {

	public static void main(String[] args) throws Exception, NoSuchAlgorithmException, URISyntaxException {
		final String REQ_QUEUE_NAME = "@request/accountCreation";
		
		// TODO Auto-generated method stub
		ConnectionFactory factory = new ConnectionFactory();
		// factory.useSslProtocol();
		factory.setUsername("guest");
		factory.setPassword("guest");
		factory.setVirtualHost("/");
		factory.setHost("localhost");
		factory.setPort(5672);
		factory.setUri("amqp://localhost:5672");

		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();
		String corrId = java.util.UUID.randomUUID().toString();
		BasicProperties props = new AMQP.BasicProperties().builder().correlationId(corrId).build();
		channel.queueDeclare(REQ_QUEUE_NAME, true, false, false, null);
		channel.basicPublish("", REQ_QUEUE_NAME, props, null);
		///System.out.println(" [x] Producer : sent '" + message + "'");

		channel.close();
		connection.close();
	}

}
