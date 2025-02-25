package com.rating.service.services;

import com.rating.service.entities.Rating;
import com.rating.service.exceptions.ResourceNotFoundException;
import com.rating.service.repositories.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    public Rating saveRating(Rating rating) {
        rating.setRatingId(UUID.randomUUID().toString());
        return ratingRepository.save(rating);
    }

    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    public Rating getRating(String id) {
        return ratingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id " + id));
    }

    public List<Rating> getRatingByUserId(String userId){
        return ratingRepository.findByUserId(userId);
    }

    public List<Rating> getRatingByHotelId(String hotelId){
        return ratingRepository.findByHotelId(hotelId);
    }
}
