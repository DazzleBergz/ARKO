package com.example.arkoperator.Controllers;

import java.util.List;
import com.example.arkoperator.Models.Vessel;
public interface VesselControllable {
    Vessel getVessel(int id);
    List<Vessel> getAllVessel();
    boolean addVessel(Vessel vessel);
    boolean removeVessel(int id);
    boolean updateVessel(Vessel vessel);

}
