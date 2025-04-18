using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace ARKODesktop.Views.Components
{
    public class ThrottleControl : Control
    {
        private int throttleValue = 0;
        public int ThrottleValue
        {
            get { return throttleValue; }
            set
            {
                throttleValue = Math.Max(0, Math.Min(value, 100));
                Invalidate(); // Redraw control
            }
        }

        public ThrottleControl()
        {
            this.Size = new Size(300, 60);
            this.SetStyle(ControlStyles.OptimizedDoubleBuffer |
                          ControlStyles.AllPaintingInWmPaint |
                          ControlStyles.UserPaint, true);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics g = e.Graphics;
            Rectangle bounds = this.ClientRectangle;

            // Draw border (optional for better UI appearance)
            using (Pen borderPen = new Pen(Color.Gray, 2))
            {
                g.DrawRectangle(borderPen, bounds.X, bounds.Y, bounds.Width - 1, bounds.Height - 1);
            }

            // Draw background
            using (SolidBrush bgBrush = new SolidBrush(Color.FromArgb(255, 39, 124, 165)))
            {
                g.FillRectangle(bgBrush, bounds);
            }

            // Draw the throttle fill (starting from bottom)
            int fillHeight = (int)(ThrottleValue / 100.0 * bounds.Height);
            using (SolidBrush fillBrush = new SolidBrush(Color.FromArgb(200, 17, 53, 71)))
            {
                g.FillRectangle(fillBrush, new Rectangle(bounds.X, bounds.Bottom - fillHeight, bounds.Width, fillHeight));
            }

            // Draw throttle percentage text at the center
            string label = $"{ThrottleValue}%";
            using (Font font = new Font("Microsoft Sans Serif", 14, FontStyle.Bold))
            using (Brush textBrush = new SolidBrush(Color.White))
            {
                SizeF textSize = g.MeasureString(label, font);
                PointF textPos = new PointF(
                    bounds.X + (bounds.Width - textSize.Width) / 2,
                    bounds.Y + (bounds.Height - textSize.Height) / 2);
                g.DrawString(label, font, textBrush, textPos);
            }
        }
    }
}
