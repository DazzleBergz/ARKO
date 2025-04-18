using System;
using System.Threading;
using System.Threading.Tasks;
using WebSocketSharp;

namespace ARKODesktop.Controller
{
    class ServerComms
    {
        private WebSocket _server;
        private string status;
        private readonly string ipAddress;
        private CancellationTokenSource _cts;

        public ServerComms(string ipAddress)
        {
            this.ipAddress = ipAddress;
            _server = new WebSocket($"ws://{ipAddress}:7777/ping");
            InitializeWebSocket();
        }

        // Initialize WebSocket
        private void InitializeWebSocket()
        {
            _server.OnMessage += (sender, e) => OnMessageReceived(e.Data);
            _server.OnOpen += (sender, e) =>
            {
                status = "●   Online";
            };
            _server.OnError += (sender, e) =>
            {
                status = "●   Offline";
            };
            _server.OnClose += (sender, e) =>
            {
                status = "●   Offline";
            };

            TryReconnect();
        }

        // Attempt to connect or reconnect
        public void TryReconnect()
        {
            Task.Run(() =>
            {
                while (!_server.IsAlive)
                {
                    try
                    {
                        Console.WriteLine("Attempting to reconnect...");
                        _server.Connect();
                        if (_server.IsAlive)
                        {
                            Console.WriteLine("Reconnected successfully.");
                            status = "●   Online";
                            StartAutoPing();
                        }
                        else
                        {
                            status = "●   Offline";
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Reconnect failed: {ex.Message}");
                        Thread.Sleep(2000); // Retry every 2 seconds
                    }
                }
            });
        }

        // Method to start automatic ping every 1 second
        public void StartAutoPing()
        {
            _cts = new CancellationTokenSource();
            var token = _cts.Token;

            Task.Run(async () =>
            {
                while (!token.IsCancellationRequested)
                {
                    try
                    {
                        if (_server != null && _server.IsAlive)
                        {
                            _server.Send("ping");
                        }
                        else
                        {
                            status = "●   Offline";
                            TryReconnect();
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error during ping: {ex.Message}");
                        status = "●   Offline";
                    }

                    await Task.Delay(2000); 
                }
            }, token);
        }

        public void Disconnect()
        {
            if (_server != null)
            {
                _cts?.Cancel(); // Stop the ping task
                _server.Close();
                Console.WriteLine("WebSocket disconnected.");
            }
        }

        // Check connection status
        public bool PingStatus()
        {
            return _server != null && _server.IsAlive;
        }

        // Get current status
        public string GetStatus()
        {
            return status ?? "●   Offline";
        }

        // Event handler for receiving messages
        private void OnMessageReceived(string message)
        {
            status = $"●   {message}"; // Update status with message
        }
    }
}
