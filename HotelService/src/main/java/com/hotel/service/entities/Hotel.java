package com.hotel.service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "hotels")
public class Hotel {

    @Id
    private String hotelId;
    private String name;
    private String location;
    private String about;

}
