package com.service.registry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/registry")
public class Controller {


    
    @GetMapping("/hi")
    public ResponseEntity<String> getHotel() {
        return ResponseEntity.ok("Connection Successful!");
    }

}
