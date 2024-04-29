package com.foodtruck.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodtruck.demo.domain.FoodTruck;
import com.foodtruck.demo.service.FoodTruckService;

@RestController
@RequestMapping("/api/foodtrucks")
public class FoodTruckController {

  @Autowired
  private FoodTruckService foodTruckService;

  @GetMapping
  public List<FoodTruck> listFoodTrucks() {
    return foodTruckService.getFoodTrucks();
  }
}
