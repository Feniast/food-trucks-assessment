package com.foodtruck.demo.service.impl;

import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.foodtruck.demo.domain.FoodTruck;
import com.foodtruck.demo.service.FoodTruckService;
import com.opencsv.bean.CsvToBeanBuilder;

@Service
public class FoodTruckServiceImpl implements FoodTruckService {

  private volatile List<FoodTruck> foodTrucks;

  private static final Logger logger = LoggerFactory.getLogger(FoodTruckServiceImpl.class);

  @Override
  public List<FoodTruck> getFoodTrucks() {
    List<FoodTruck> result;
    try {
      result = readFoodTrucks();
    } catch (IOException e) {
      logger.error("Failed to read food trucks csv", e);
      result = new ArrayList<>();
    }
    return result;
  }

  private List<FoodTruck> readFoodTrucks() throws IOException {
    if (foodTrucks != null)
      return foodTrucks;
    synchronized (this) {
      if (foodTrucks == null) {
        ClassPathResource resource = new ClassPathResource("Mobile_Food_Facility_Permit.csv");
        List<FoodTruck> result = new CsvToBeanBuilder<FoodTruck>(new FileReader(resource.getFile()))
            .withType(FoodTruck.class).build().parse();
        foodTrucks = result;
      }
    }
    return foodTrucks;
  }

}
