package com.api.gateway;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class APIController {
  

    @GetMapping("/health")
    public ResponseEntity<String> test() {
        
        return ResponseEntity.ok("Connection to gatway successful!");
    }

   
}
