using ARKODesktop.Models;
using System;
using System.Threading.Tasks;
using WebSocketSharp;
using Newtonsoft.Json; // Make sure to install Newtonsoft.Json package

namespace ARKODesktop.Controller
{
    public class Commands
    {
        private WebSocket _client;
        private string ipAddress;
        private string token;

        public Commands(string ipAddress, string token)
        {
            this.ipAddress = ipAddress;
            this.token = token;
            StartCommands();
        }

        public void StartCommands()
        {
            if (_client == null || !_client.IsAlive)
            {
                _client = new WebSocket($"ws://{this.ipAddress }:4343/{this.token}");
                _client.OnOpen += (sender, e) => Console.WriteLine("WebSocket connected.");
                _client.OnClose += (sender, e) => Console.WriteLine("WebSocket connection closed.");
                _client.OnError += (sender, e) => Console.WriteLine($"WebSocket error: {e.Message}");
                _client.ConnectAsync();
            }
        }

        private async Task SendCommandAsync(byte speed, bool lights, bool engine,string movement, string turn)
        {
            try
            {
                if (_client != null && _client.IsAlive)
                {
                    var command = new
                    {
                        speed = speed,
                        lights = lights,
                        engine = engine,
                        move = movement,
                        turn = turn
                    };

                    string jsonMessage = JsonConvert.SerializeObject(command);
                    await Task.Run(() => _client.Send(jsonMessage));

                    Console.WriteLine($"Command sent: {jsonMessage}");
                }
                else
                {
                    Console.WriteLine("WebSocket is not connected.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending control command: {ex.Message}");
            }
        }

        public void SendControlCommand(byte speed, bool lights, bool engine,string movement, string turn)
        {
            Task.Run(() => SendCommandAsync(speed, lights, engine, movement, turn));
        }

        // Close WebSocket connection (optional cleanup)
        public void CloseConnection()
        {
            if (_client != null && _client.IsAlive)
            {
                _client.CloseAsync();
            }
        }
    }
}
