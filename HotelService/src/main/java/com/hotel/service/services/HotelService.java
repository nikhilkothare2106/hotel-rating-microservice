package com.hotel.service.services;



import com.hotel.service.entities.Hotel;
import com.hotel.service.exceptions.ResourceNotFoundException;
import com.hotel.service.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HotelService {
    @Autowired
    private HotelRepository hotelRepository;

    public Hotel saveHotel(Hotel Hotel){
        Hotel.setHotelId(UUID.randomUUID().toString());
        return hotelRepository.save(Hotel);
    }

    public List<Hotel> getAllHotels(){
        return hotelRepository.findAll();
    }

    public Hotel getHotel(String id){
        return hotelRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Hotel not found with id "+ id));
    }


}
