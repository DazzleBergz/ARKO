package com.example.arkoperator.Services;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.example.arkoperator.Controllers.VesselControllable;
import com.example.arkoperator.Models.Vessel;

import java.util.ArrayList;
import java.util.List;

public class VesselService extends SQLiteOpenHelper implements VesselControllable {
    private static final String DATABASE_NAME = "ArkoSweet.db";
    private static final int DATABASE_VERSION = 1;

    // Table and Columns
    private static final String TABLE_NAME = "vessels";
    private static final String COLUMN_ID = "vessel_id";
    private static final String COLUMN_NAME = "vessel_name";
    private static final String COLUMN_NETWORK = "network_name";
    private static final String COLUMN_IP = "ip_address";
    private static final String COLUMN_TOKEN = "token";

    public ContentValues values;

    public VesselService(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }
    @Override
    public void onCreate(SQLiteDatabase db) {
        String createTable = "CREATE TABLE " + TABLE_NAME + " (" +
                COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COLUMN_NAME + " TEXT, " +
                COLUMN_NETWORK + " TEXT, " +
                COLUMN_IP + " TEXT, " +
                COLUMN_TOKEN + " TEXT)";
        db.execSQL(createTable);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int i, int i1) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_NAME);
        onCreate(db);
    }


    @Override
    public Vessel getVessel(int id) {

        try (SQLiteDatabase db = this.getReadableDatabase();
             Cursor cursor = db.rawQuery("SELECT * FROM " + TABLE_NAME + " WHERE vessel_id = ?",
                             new String[]{String.valueOf(id)})) {
            if (cursor.moveToFirst()) {
                return getVesselInfo(cursor);
            } else {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Vessel> getAllVessel() {
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor rs = db.rawQuery("SELECT * FROM " + TABLE_NAME, null);
        rs.moveToFirst();
        return getVesselsInfo(rs);
    }

    @Override
    public boolean addVessel(Vessel vessel) {
        SQLiteDatabase db = this.getWritableDatabase();
        values = new ContentValues();
        values.put(COLUMN_NAME, vessel.getVesselName());
        values.put(COLUMN_NETWORK, vessel.getNetworkName());
        values.put(COLUMN_IP, vessel.getIpAddress());
        values.put(COLUMN_TOKEN, vessel.getToken());
        long result = db.insert(TABLE_NAME, null, values);
        return result != -1;
    }

    @Override
    public boolean removeVessel(int id) {
        try (SQLiteDatabase db = this.getWritableDatabase()) {
            int rowsDeleted = db.delete(TABLE_NAME, "vessel_id = ?", new String[]{String.valueOf(id)});
            return rowsDeleted > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateVessel(Vessel vessel) {
        try (SQLiteDatabase db = this.getWritableDatabase()) {
            values = new ContentValues();
            values.put(COLUMN_NAME, vessel.getVesselName());
            values.put(COLUMN_NETWORK, vessel.getNetworkName());
            values.put(COLUMN_IP, vessel.getIpAddress());
            values.put(COLUMN_TOKEN, vessel.getToken());
            long result = db.update(TABLE_NAME, values, "vessel_id = ?", new String[]{String.valueOf(vessel.getId())});
            return result != -1;
        } catch (Exception e) {
            return false;
        }
    }

    private Vessel getVesselInfo(Cursor rs) {
        int idIndex = rs.getColumnIndex("vessel_id");
        int vesselNameIndex = rs.getColumnIndex("vessel_name");
        int networkNameIndex = rs.getColumnIndex("network_name");
        int ipAddressIndex = rs.getColumnIndex("ip_address");
        int tokenIndex = rs.getColumnIndex("token");

        int id = idIndex >= 0 ? rs.getInt(idIndex) : 0;
        String vesselName = vesselNameIndex >= 0 ? rs.getString(vesselNameIndex) : "";
        String networkName = networkNameIndex >= 0 ? rs.getString(networkNameIndex) : "";
        String ipAddress = ipAddressIndex >= 0 ? rs.getString(ipAddressIndex) : "";
        String token = tokenIndex >= 0 ? rs.getString(tokenIndex) : "";

        return new Vessel(id, vesselName, networkName, ipAddress, token);
    }

    private List<Vessel> getVesselsInfo(Cursor rs){
        List<Vessel> vesselList = new ArrayList<>();
        while (!rs.isAfterLast()){

            int id = rs.getColumnIndex(COLUMN_ID);
            int vName = rs.getColumnIndex(COLUMN_NAME);
            int nName = rs.getColumnIndex(COLUMN_NETWORK);
            int ip = rs.getColumnIndex(COLUMN_TOKEN);
            int tk = rs.getColumnIndex(COLUMN_TOKEN);

            id = id >= 0 ? rs.getInt(id) : 0;
            String vessel_name = vName >= 0 ? rs.getString(vName) : "";
            String network_name = nName >= 0 ? rs.getString(nName) : "";
            String ip_address = ip >= 0 ? rs.getString(ip) : "";
            String token = tk >= 0 ? rs.getString(tk) : "";

            vesselList.add(new Vessel(id, vessel_name,network_name,ip_address,token));
        }

        return vesselList;
    }
}
