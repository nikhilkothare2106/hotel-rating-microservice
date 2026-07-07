package com.service.registry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/registry")
public class Controller {


    
    @GetMapping("/")
    public ResponseEntity<String> getHotel(@PathVariable String id) {
        return ResponseEntity.ok("Connection Successful!");
    }

}
