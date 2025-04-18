using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ARKODesktop.Models;
using System.Net.Http.Headers;
using System.Configuration;

namespace ARKODesktop.Controllers
{
    public class AuthController
    {
        private readonly HttpClient _client;
        private readonly string _baseUrl = "https://your-api-url.com/api";

        public AuthController()
        {
            _client = new HttpClient();
        }

        // 🔹 User Login
        public async Task<string> LoginAsync(string username, string password)
        {
            var requestData = new { username, password };
            string jsonData = JsonConvert.SerializeObject(requestData);

            HttpContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _client.PostAsync($"{_baseUrl}/login", content);

            if (response.IsSuccessStatusCode)
            {
                var responseData = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

                // Store token in app settings
                Properties.Settings.Default.UserToken = responseData.token;
                Properties.Settings.Default.Save();

                return "Login Successful";
            }
            else
            {
                return "Invalid Credentials";
            }
        }

        // 🔹 User Registration
        public async Task<string> RegisterAsync(UserModel user, string otp)
        {
            var requestData = new
            {
                username = user.Username,
                email = user.Email,
                password = user.Password,
                type = user.Type,
                otp = otp
            };

            string jsonData = JsonConvert.SerializeObject(requestData);
            HttpContent content = new StringContent(jsonData, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _client.PostAsync($"{_baseUrl}/register", content);

            if (response.IsSuccessStatusCode)
            {
                return "Registration Successful";
            }
            else
            {
                return "Registration Failed";
            }
        }
    }
}
