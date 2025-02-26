package com.user.service.controllers;

import com.user.service.entities.User;
import com.user.service.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User user1 = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(user1);
    }

//    int retryCount = 1;

    @GetMapping("/{userId}")
//    @CircuitBreaker(name = "ratingHotelBreaker", fallbackMethod = "ratingHotelFallBack")
//    @Retry(name = "ratingHotelService", fallbackMethod = "ratingHotelFallBack")
//    @RateLimiter(name = "userRateLimiter", fallbackMethod = "ratingHotelFallBack")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
//        log.info("Retry count: {}", retryCount);
//        retryCount++;
        User user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    //fall back method for circuit breaker

    public ResponseEntity<User> ratingHotelFallBack(String userId, Exception exception) {
        log.info("Service is down:", exception.getMessage());
        User dummy = User.builder().email("dummy@gmail.com")
                .name("Dummy")
                .about("Dummy user created because some services are down!")
                .userId("111111")
                .build();
//        retryCount = 1;
        return new ResponseEntity<>(dummy, HttpStatus.OK);
    }
}
