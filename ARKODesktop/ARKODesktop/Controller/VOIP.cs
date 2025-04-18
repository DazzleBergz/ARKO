using System;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;
using NAudio.Wave;

namespace ARKODesktop.Controller
{
    class VOIP
    {
        private UdpClient udpClient;
        private WaveInEvent waveIn;
        private WaveOutEvent waveOut;
        private BufferedWaveProvider waveProvider;
        private IPEndPoint serverEndPoint;
        private string ipAddress;
        public VOIP(string ipAddress)
        { 
            this.ipAddress = ipAddress;
        }

        public void StartRecording()
        {
            try
            {
                udpClient = new UdpClient();
                serverEndPoint = new IPEndPoint(IPAddress.Parse(this.ipAddress), 8712);

                waveIn = new WaveInEvent
                {
                    WaveFormat = new WaveFormat(48000, 16, 1),
                    BufferMilliseconds = 100
                };
                waveIn.DataAvailable += WaveIn_DataAvailable;

                Task.Run(() =>
                {
                    waveIn.StartRecording();
                });

                Console.WriteLine("Recording started.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error starting recording: {ex.Message}");
            }
        }

        public async void StartReceiving()
        {
            try
            {
                udpClient = new UdpClient(8712);

                waveOut = new WaveOutEvent();
                waveProvider = new BufferedWaveProvider(new WaveFormat(44100, 16, 1))
                {
                    BufferLength = 8192 * 10,
                    DiscardOnBufferOverflow = true
                };

                waveOut.Init(waveProvider);
                waveOut.Play();

                serverEndPoint = new IPEndPoint(IPAddress.Any, 8712);

                await Task.Run(ReceiveAudioData);

                Console.WriteLine("Receiving audio started.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error starting receiving audio: {ex.Message}");
            }
        }

        private async Task ReceiveAudioData()
        {
            while (true)
            {
                try
                {
                    byte[] receivedBytes = udpClient.Receive(ref serverEndPoint);
                    waveProvider.AddSamples(receivedBytes, 0, receivedBytes.Length);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error receiving audio data: {ex.Message}");
                    break;
                }
                await Task.Delay(15);
            }
        }

        private void WaveIn_DataAvailable(object sender, WaveInEventArgs e)
        {
            Task.Run(() =>
            {
                try
                {
                    if (udpClient != null && serverEndPoint != null)
                    {
                        udpClient.Send(e.Buffer, e.BytesRecorded, serverEndPoint);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending audio data: {ex.Message}");
                }
            });
        }

        public async void ToggleMic(bool isMicEnabled)
        {
            try
            {
                if (isMicEnabled)
                {
                    waveIn?.StopRecording();
                    waveIn?.Dispose();
                    waveIn = null;
                }
                else
                {
                    waveIn = new WaveInEvent
                    {
                        WaveFormat = new WaveFormat(48000, 16, 1),
                        BufferMilliseconds = 100
                    };
                    waveIn.DataAvailable += WaveIn_DataAvailable;
                    await Task.Run(() =>
                    {
                        waveIn.StartRecording();
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling mic: {ex.Message}");
            }
        }

        public void ToggleSpeaker(bool isSpeakerEnabled)
        {
            try
            {
                if (isSpeakerEnabled)
                {
                    waveOut?.Stop();
                    waveProvider?.ClearBuffer();
                }
                else
                {
                    waveOut?.Play();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling speaker: {ex.Message}");
            }
        }

        public void closeVOIP()
        {

            waveIn?.StopRecording();
            waveIn?.Dispose();

            waveOut?.Stop();
            waveOut?.Dispose();
        }


    }
}
