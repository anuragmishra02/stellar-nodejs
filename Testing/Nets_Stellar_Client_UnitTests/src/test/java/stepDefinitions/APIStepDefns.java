package stepDefinitions;

import java.io.FileInputStream;
import java.util.Properties;

import org.json.JSONObject;
import org.junit.Assert;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.AMQP.BasicProperties;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;

public class APIStepDefns {
	private static final String REQ_QUEUE_NAME = "@request/accountCreation";
	private static final String RES_QUEUE_NAME = "@response/accountCreation";
	private static final String REQ_QUEUE_NAME_FREETOKENS = "@request/freeTokens";
	private static final String RES_QUEUE_NAME_FREETOKENS = "@response/freeTokens";
	public static Properties CONFIG;
	static String message;

	@cucumber.api.java.Before
	public static void initializationMethod() throws Exception {

		System.out.println("Executing initialization method");
		CONFIG = new Properties();
		FileInputStream CONFIG_FIS = new FileInputStream(System.getProperty("user.dir") + "/CONFIG.properties");
		CONFIG.load(CONFIG_FIS);
	}

	@Given("^I send a Request To RabbitMQ$")
	public void RequestWithRabbitMQ() throws Exception {

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
		System.out.println(" [x] Producer : sent '" + message + "'");

		channel.close();
		connection.close();
	}

	@Then("^I get Response From RabbitMQ$")
	public void ResponseFromRabbitMQForAccountCreation() throws Exception {

		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();

		// configure message queues as durable
		boolean durable = true;

		channel.queueDeclare(RES_QUEUE_NAME, durable, false, false, null);
		System.out.println(" [*] Consumer : waiting for messages. To exit press CTRL+C");
		DeliverCallback deliverCallback = (consumerTag, delivery) -> {
			String message = new String(delivery.getBody(), "UTF-8");
			System.out.println(" [x] Received '" + message + "'");
			JSONObject data = new JSONObject(message.toString());
			String res = null;
			if (!org.json.JSONObject.NULL.equals(data.opt("error")) && data.getString("error") != null) {
				res = data.getString("error");
			}
			Assert.assertEquals(null, res);

		};
		channel.basicConsume(RES_QUEUE_NAME, true, deliverCallback, consumerTag -> {
		});
	}

	@Given("^I send a Request with ([^\\\\\\\"]*) Input$")
	public void RequestWithRabbitMQForFreeTokens(String input) throws Exception {

		if (input.equalsIgnoreCase("Valid")) {
			message = CONFIG.getProperty("ValidParameters");
		} else if (input.equalsIgnoreCase("Invalid")) {
			message = CONFIG.getProperty("InvalidParameters");
		}
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
		channel.queueDeclare(REQ_QUEUE_NAME_FREETOKENS, true, false, false, null);
		channel.basicPublish("", REQ_QUEUE_NAME_FREETOKENS, props, message.getBytes());
		System.out.println(" [x] Producer : sent '" + message + "'");

		channel.close();
		connection.close();
	}

	@Then("^I get Response For ([^\\\\\\\"]*) Input$")
	public void ResponseFromRabbitMQForFreeToken(String input) throws Exception {

		ConnectionFactory factory = new ConnectionFactory();
		factory.setHost("localhost");
		Connection connection = factory.newConnection();
		Channel channel = connection.createChannel();

		// configure message queues as durable
		boolean durable = true;

		channel.queueDeclare(RES_QUEUE_NAME_FREETOKENS, durable, false, false, null);
		System.out.println(" [*] Consumer : waiting for messages. To exit press CTRL+C");
		Thread.sleep(2000);

		DeliverCallback deliverCallback = (consumerTag, delivery) -> {
			String message = new String(delivery.getBody(), "UTF-8");

			System.out.println(" [x] Received '" + message + "'");
			if (input.equalsIgnoreCase("Valid")) {
				JSONObject data = new JSONObject(message.toString());

				String res = null;
				if (!org.json.JSONObject.NULL.equals(data.opt("error")) && data.getString("error") != null) {
					res = data.getString("error");
					Assert.assertEquals(null, res);

				}
			} else if (input.equalsIgnoreCase("Invalid")) {
				JSONObject data = new JSONObject(message.toString());

				String res = null;
				if (!org.json.JSONObject.NULL.equals(data.opt("data")) && data.getString("data") != null) {
					res = data.getString("data");
					Assert.assertEquals(null, res);

				}
			}
		};
		channel.basicConsume(RES_QUEUE_NAME_FREETOKENS, true, deliverCallback, consumerTag -> {

		});
		Thread.sleep(2000);
	}

}
