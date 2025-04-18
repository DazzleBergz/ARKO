using System;
using Newtonsoft.Json;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

public class ServerReadings
{
    public class GPSData
    {
        [JsonProperty("Latitude")]
        public double Latitude { get; set; }

        [JsonProperty("Longitude")]
        public double Longitude { get; set; }
    }

    public class SensorData
    {
        [JsonProperty("GPS")]
        public GPSData GPS { get; set; }

        [JsonProperty("water_level")]
        public int WaterLevel { get; set; }

        [JsonProperty("detected")]
        public string Detected { get; set; }

        [JsonProperty("speed")]
        public int Speed { get; set; }
    }

    public string Detected { get; private set; }
    public GPSData GPS { get; private set; }
    public double WaterLevel { get; private set; }

    private readonly string ipAddress;
    private readonly string token;

    public ServerReadings(string ipAddress, string token)
    {
        this.ipAddress = ipAddress;
        this.token = token;
        GPS = new GPSData();

        // Initialize the WebSocket connection
        _ = InitializeSocket();
    }

    private async Task InitializeSocket()
    {
        try
        {
            await ConnectAndListenAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error initializing WebSocket: {ex.Message}");
        }
    }

    public async Task ConnectAndListenAsync()
    {
        string uri = $"ws://{ipAddress}:5000";
        using (ClientWebSocket webSocket = new ClientWebSocket())
        {
            try
            {
                Console.WriteLine($"Connecting to {uri}...");
                await webSocket.ConnectAsync(new Uri(uri), CancellationToken.None);
                Console.WriteLine("Connected to server!");

                // Send the token to authenticate
                await SendMessageAsync(webSocket, new { token });

                // Start receiving messages
                await ReceiveMessagesAsync(webSocket);
            }
            catch (WebSocketException e)
            {
                Console.WriteLine($"WebSocket error: {e.Message}");
            }
            finally
            {
                if (webSocket.State == WebSocketState.Open)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                }
                Console.WriteLine("WebSocket connection closed.");
            }
        }
    }

    private async Task SendMessageAsync(ClientWebSocket webSocket, object message)
    {
        try
        {
            string jsonMessage = JsonConvert.SerializeObject(message);
            var bytesToSend = Encoding.UTF8.GetBytes(jsonMessage);
            var buffer = new ArraySegment<byte>(bytesToSend);

            await webSocket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine("Sent message to server.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending message: {ex.Message}");
        }
    }

    private async Task ReceiveMessagesAsync(ClientWebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        while (webSocket.State == WebSocketState.Open)
        {
            try
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"Message received: {message}");

                    ProcessMessage(message);
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine("Server requested close.");
                    break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error receiving message: {ex.Message}");
                break;
            }
        }
    }

    private void ProcessMessage(string message)
    {
        try
        {
            var data = JsonConvert.DeserializeObject<SensorData>(message);

            // Update properties
            GPS = data.GPS;
            WaterLevel = data.WaterLevel;
            Detected = data.Detected;
        }
        catch (JsonException e)
        {
            Console.WriteLine($"Failed to deserialize message: {e.Message}");
        }
    }
}
