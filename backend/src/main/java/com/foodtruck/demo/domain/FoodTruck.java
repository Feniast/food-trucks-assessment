package com.foodtruck.demo.domain;

import com.opencsv.bean.CsvBindByName;

public class FoodTruck {
  @CsvBindByName(column = "locationid")
  private Integer locationId;

  @CsvBindByName(column = "Applicant")
  private String applicant;

  @CsvBindByName(column = "FacilityType")
  private String facilityType;

  @CsvBindByName(column = "cnn")
  private String cnn;

  @CsvBindByName(column = "LocationDescription")
  private String locationDescription;

  @CsvBindByName(column = "Address")
  private String address;

  @CsvBindByName(column = "blocklot")
  private String blocklot;

  @CsvBindByName(column = "block")
  private String block;

  @CsvBindByName(column = "lot")
  private String lot;

  @CsvBindByName(column = "permit")
  private String permit;

  @CsvBindByName(column = "status")
  private String status;

  @CsvBindByName(column = "FoodItems")
  private String foodItems;

  @CsvBindByName(column = "X")
  private Double x;

  @CsvBindByName(column = "Y")
  private Double y;

  @CsvBindByName(column = "Latitude")
  private Double latitude;

  @CsvBindByName(column = "Longitude")
  private Double longitude;

  @CsvBindByName(column = "Schedule")
  private String schedule;

  @CsvBindByName(column = "dayshours")
  private String dayshours;

  @CsvBindByName(column = "Zip Codes")
  private String zip;

  public Integer getLocationId() {
    return locationId;
  }

  public void setLocationId(Integer locationId) {
    this.locationId = locationId;
  }

  public String getApplicant() {
    return applicant;
  }

  public void setApplicant(String applicant) {
    this.applicant = applicant;
  }

  public String getFacilityType() {
    return facilityType;
  }

  public void setFacilityType(String facilityType) {
    this.facilityType = facilityType;
  }

  public String getCnn() {
    return cnn;
  }

  public void setCnn(String cnn) {
    this.cnn = cnn;
  }

  public String getLocationDescription() {
    return locationDescription;
  }

  public void setLocationDescription(String locationDescription) {
    this.locationDescription = locationDescription;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getBlocklot() {
    return blocklot;
  }

  public void setBlocklot(String blocklot) {
    this.blocklot = blocklot;
  }

  public String getBlock() {
    return block;
  }

  public void setBlock(String block) {
    this.block = block;
  }

  public String getLot() {
    return lot;
  }

  public void setLot(String lot) {
    this.lot = lot;
  }

  public String getPermit() {
    return permit;
  }

  public void setPermit(String permit) {
    this.permit = permit;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getFoodItems() {
    return foodItems;
  }

  public void setFoodItems(String foodItems) {
    this.foodItems = foodItems;
  }

  public Double getX() {
    return x;
  }

  public void setX(Double x) {
    this.x = x;
  }

  public Double getY() {
    return y;
  }

  public void setY(Double y) {
    this.y = y;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }

  public String getSchedule() {
    return schedule;
  }

  public void setSchedule(String schedule) {
    this.schedule = schedule;
  }

  public String getDayshours() {
    return dayshours;
  }

  public void setDayshours(String dayshours) {
    this.dayshours = dayshours;
  }

  public String getZip() {
    return zip;
  }

  public void setZip(String zip) {
    this.zip = zip;
  }

}
