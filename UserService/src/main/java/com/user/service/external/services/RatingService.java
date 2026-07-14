package com.user.service.external.services;

import com.user.service.entities.Rating;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Service
@FeignClient(
    name = "${services.rating.name}",
    url = "${services.rating.url:}"
)
public interface RatingService {

    @PostMapping("/ratings")
    public Rating createRating(Rating rating);

    @GetMapping("/ratings/users/{userId}")
    public List<Rating> getRatingByUserId(@PathVariable String userId);
}

