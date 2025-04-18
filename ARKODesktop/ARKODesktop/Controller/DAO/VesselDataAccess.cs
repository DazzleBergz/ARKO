using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Windows.Forms;
using ARKODesktop.Models;

namespace ARKODesktop.Controller.DAO
{
    class VesselDataAccess
    {
        private string connectionString = $@"Data Source={Application.StartupPath}\ArkoDB.db;Version=3;";
        public bool AddVessel(BluetoothComms btInfo)
        {
            MessageBox.Show($"Database Path: {connectionString}", "Debug Path", MessageBoxButtons.OK, MessageBoxIcon.Information);
            string deviceName = btInfo.DeviceName;
            string ipAddress = btInfo.IpAddress;
            string networkName = btInfo.DeviceNetwork;
            string token = btInfo.Token;
            string dateCreated = DateTime.Now.ToString("yyyy-MM-dd");
            string timeCreated = DateTime.Now.ToString("HH:mm:ss tt");

            try
            {
                using (SQLiteConnection con = new SQLiteConnection(connectionString))
                {
                    con.Open();
                    string addDevice = "INSERT INTO Vessel" +
                                        "([vessel_name], [ip_address], [network_name], [token], [date_created], [time_created]) VALUES" +
                                        "(@DeviceName, @IpAddress, @NetworkName, @Token, @DateCreated, @TimeCreated)";

                    using (SQLiteCommand cmd = new SQLiteCommand(addDevice, con))
                    {
                        cmd.Parameters.AddWithValue("@DeviceName", deviceName);
                        cmd.Parameters.AddWithValue("@IpAddress", ipAddress);
                        cmd.Parameters.AddWithValue("@NetworkName", networkName);
                        cmd.Parameters.AddWithValue("@Token", token);
                        cmd.Parameters.AddWithValue("@DateCreated", dateCreated);
                        cmd.Parameters.AddWithValue("@TimeCreated", timeCreated);

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

        public List<Vessel> SelectAllVessel()
        {
            List<Vessel> vesselList = new List<Vessel>(); // Create a list to store vessels

            try
            {
                using (SQLiteConnection con = new SQLiteConnection(connectionString))
                {
                    con.Open();
                    string query = @"SELECT * FROM Vessel";

                    using (SQLiteCommand cmd = new SQLiteCommand(query, con))
                    {
                        using (SQLiteDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Vessel vessel = new Vessel()
                                {
                                    Vessel_id = int.Parse(reader["vessel_id"].ToString()),
                                    Vessel_name = reader["vessel_name"].ToString(),
                                    Ip_address = reader["ip_address"].ToString(),
                                    Network_name = reader["network_name"].ToString(),
                                    Date_created = reader["date_created"].ToString(),
                                    Time_created = reader["time_created"].ToString()

                                };

                                vesselList.Add(vessel);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }

            return vesselList;
        }

    }
}
