using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SQLite;
using System.Text.RegularExpressions;
using System.Net.Mail;
using System.Net;

namespace ARKODesktop.Controller.DAO
{
    
    public class UserDataAccess
    {
        private string generatedOTP;
        private string connectionString = $@"Data Source={Application.StartupPath}\ArkoDB.db;Version=3;";

        public bool AddUser()
        {
            MessageBox.Show($"Database Path: {connectionString}", "Debug Path", MessageBoxButtons.OK, MessageBoxIcon.Information);

            string firstName = "";
            string lastName = "";
            string middleName = "";
            string role = "";
            string username = "";
            string password = "";
            string email = "";
            string dateCreated = DateTime.Now.ToString("yyyy-MM-dd");
            string timeCreated = DateTime.Now.ToString("HH:mm:ss tt");


            try
            {
                using (SQLiteConnection con = new SQLiteConnection(connectionString))
                {
                    con.Open();
                    string addUser = "INSERT INTO Users" +
                                        "([f_name], [l_name], [m_name], [role], [username], [password], [email], [time_created], [date_created]) VALUES" +
                                        "(@FirstName, @LastName, @MiddleName, @Role, @Username, @Password, @Email, @TimeCreated, @DateCreated)";

                    using (SQLiteCommand cmd = new SQLiteCommand(addUser, con))
                    {
                        cmd.Parameters.AddWithValue("@FirstName", firstName);
                        cmd.Parameters.AddWithValue("@LastName", lastName);
                        cmd.Parameters.AddWithValue("@MiddleName", middleName);
                        cmd.Parameters.AddWithValue("@Role", role);
                        cmd.Parameters.AddWithValue("@Username", username);
                        cmd.Parameters.AddWithValue("@Password", password);
                        cmd.Parameters.AddWithValue("@Email", email);
                        cmd.Parameters.AddWithValue("@TimeCreated", timeCreated);
                        cmd.Parameters.AddWithValue("@TimeCreated", dateCreated);

                        int rowsAffected = cmd.ExecuteNonQuery();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}", "Insert Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }
        }

        private async Task<bool> IsUsernameExists(string username)
        {
            try
            {
                using (SQLiteConnection con = new SQLiteConnection(connectionString))
                {
                    await con.OpenAsync(); // Open the connection asynchronously
                    string query = "SELECT COUNT(*) FROM Users WHERE username = @username";

                    using (SQLiteCommand cmd = new SQLiteCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@username", username);

                        // ExecuteScalarAsync retrieves the first column of the first row in the result set
                        object result = await cmd.ExecuteScalarAsync();

                        return Convert.ToInt32(result) > 0; // If count > 0, username exists
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred while checking username existence: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }
        }

        private async Task<bool> IsEmailExsists(string username)
        {
            try
            {
                using (SQLiteConnection con = new SQLiteConnection(connectionString))
                {
                    await con.OpenAsync(); // Open the connection asynchronously
                    string query = "SELECT COUNT(*) FROM Users WHERE email = @email";

                    using (SQLiteCommand cmd = new SQLiteCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@email", username);

                        // ExecuteScalarAsync retrieves the first column of the first row in the result set
                        object result = await cmd.ExecuteScalarAsync();

                        return Convert.ToInt32(result) > 0; // If count > 0, username exists
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred while checking username existence: {ex.Message}",
                    "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return false;
            }
        }

        private bool IsValidEmail(string email)
        {

            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, emailPattern);
        }

        private string GenerateRandomOTP()
        {
            Random rand = new Random();
            return rand.Next(100000, 999999).ToString(); // 6-digit OTP
        }

        private async void btnGetOTP_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(""))
            {
                MessageBox.Show("Please enter a valid email address.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                return;
            }

            bool emailExists = await IsEmailExsists("");
            if (emailExists)
            {
                MessageBox.Show("Email already exists. Please choose another.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                return;
            }

            generatedOTP = GenerateRandomOTP();
            if (await SendEmailAsync("", "Your OTP Code", $"Your OTP code is {generatedOTP}"))
            {
                MessageBox.Show("OTP sent to your email.", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

            }
            else
            {
                MessageBox.Show("Failed to send OTP. Please check your email address.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

            }
        }

        private async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("arkoVessel@gmail.com", "jtcz lyxq gwjt qcuo"),
                    EnableSsl = true
                };
                MailMessage mail = new MailMessage("youremail@gmail.com", toEmail, subject, body);
                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to send email: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                return false;
            }
        }
    }
}
