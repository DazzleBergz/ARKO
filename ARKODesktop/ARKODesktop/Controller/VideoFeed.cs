using System;
using System.Drawing;
using AForge.Video;
using System.Windows.Forms;

namespace ARKODesktop.Controller
{
    class VideoFeed
    {
        private MJPEGStream mjpegStream;
        private PictureBox pcbCam;
        

        public void StartCamera(String IpCam, object pcbCam)
        {
            string streamUrl = $"http://{IpCam}:4000";
            mjpegStream = new MJPEGStream(streamUrl);
            mjpegStream.NewFrame += new NewFrameEventHandler(video_NewFrame);
            mjpegStream.Start();

            this.pcbCam = pcbCam as PictureBox;
        }
        public void StopCamera()
        {
            if (mjpegStream != null && mjpegStream.IsRunning)
            {
                mjpegStream.SignalToStop(); 
                mjpegStream.WaitForStop();
                mjpegStream.NewFrame -= video_NewFrame;
                mjpegStream = null;
            }

            // Clear the picture box
            if (pcbCam != null)
            {
                pcbCam.Image = null;
            }
        }

        private void video_NewFrame(object sender, NewFrameEventArgs eventArgs)
        {
            pcbCam.Image = (Bitmap)eventArgs.Frame.Clone();
        }

    }
}
