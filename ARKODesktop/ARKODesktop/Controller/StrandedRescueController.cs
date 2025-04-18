using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using ARKODesktop.Models;
using Newtonsoft.Json;

namespace ARKODesktop.Controllers
{
    public class StrandedRescueController
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "http://192.168.1.213:8000/api/";

        public StrandedRescueController()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(BaseUrl)
            };
        }

        public async Task<List<StrandedRescue>> GetOngoingRescueRequestsAsync()
        {
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync("rescues/ongoing");

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();

                    // Parse the specific structure of the response
                    var result = JsonConvert.DeserializeObject<OngoingRescueResponse>(responseBody);

                    return result.PendingRescues;
                }
                else
                {
                    throw new Exception($"Failed to retrieve ongoing rescue requests. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching ongoing rescue requests: {ex.Message}");
            }
        }

        // Helper class to match the API response structure
        private class OngoingRescueResponse
        {
            [JsonProperty("message")]
            public string Message { get; set; }

            [JsonProperty("pending_rescues")]
            public List<StrandedRescue> PendingRescues { get; set; }

            [JsonProperty("total_pending")]
            public int TotalPending { get; set; }
        }
    }
}