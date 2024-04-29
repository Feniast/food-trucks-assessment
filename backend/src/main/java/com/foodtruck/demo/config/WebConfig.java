package com.foodtruck.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${cors.origins}")
  private String[] corsOrigins;

  @Value("${cors.allow-headers}")
  private String[] corsAllowHeaders;

  @Value("${cors.expose-headers}")
  private String[] corsExposeHeaders;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowCredentials(true)
        .allowedOrigins(corsOrigins)
        .allowedHeaders(corsAllowHeaders)
        .exposedHeaders(corsExposeHeaders)
        .allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE");
  }

}
