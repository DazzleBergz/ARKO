package com.example.arkoperator.Models;

public class Vessel {

    private int id;
    private String vesselName;
    private String networkName;
    private String ipAddress;
    private String token;

    public Vessel(int id, String vesselName, String networkName, String ipAddress, String token) {
        this.id = id;
        this.vesselName = vesselName;
        this.networkName = networkName;
        this.ipAddress = ipAddress;
        this.token = token;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVesselName() {
        return vesselName;
    }

    public void setVesselName(String vesselName) {
        this.vesselName = vesselName;
    }

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
