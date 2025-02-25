package com.user.service.services;

import com.user.service.entities.Hotel;
import com.user.service.entities.Rating;
import com.user.service.entities.User;
import com.user.service.exceptions.ResourceNotFoundException;
import com.user.service.external.services.HotelService;
import com.user.service.external.services.RatingService;
import com.user.service.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private RestTemplate restTemplate;

    public User saveUser(User user){
        user.setUserId(UUID.randomUUID().toString());
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUser(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        // get rating of user from Rating Service

//        ArrayList userRating = restTemplate.getForObject("http://localhost:8083/ratings/users/"+id, ArrayList.class);
//        Rating[] userRating = restTemplate.getForObject("http://RATINGSERVICE/ratings/users/" + id, Rating[].class);
//        List<Rating> ratingByUserId = Arrays.asList(userRating);
        List<Rating> ratingByUserId = ratingService.getRatingByUserId(user.getUserId());

        List<Rating> ratingList = ratingByUserId.stream().map(rating -> {
//            ResponseEntity<Hotel> hotelEntity = restTemplate.getForEntity("http://HOTELSERVICE/hotels/" + rating.getHotelId(), Hotel.class);
//            Hotel hotel = hotelEntity.getBody();
            Hotel hotel = hotelService.getHotel(rating.getHotelId());
            rating.setHotel(hotel);
            return rating;
        }).collect(Collectors.toList());
        user.setRatings(ratingList);
        return user;
    }


}
