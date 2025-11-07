package com.pudding.base.domain.naver.api;

import com.pudding.base.domain.store.dto.StoreAddressDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class NaverGecode {
    @Value("${NaverGeocoding.x-ncp-apigw-api-key-id}")
    private String apiKey;

    @Value("${NaverGeocoding.x-ncp-apigw-api-key}")
    private String apiSecretKey;

    private String apiUrl = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
    public StoreAddressDto geocodeAddress(String address){
        WebClient webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeaders(httpHeaders -> {
                    httpHeaders.add("Accept", "application/json");
                    httpHeaders.add("x-ncp-apigw-api-key-id", apiKey);
                    httpHeaders.add("x-ncp-apigw-api-key", apiSecretKey);
                })
                .build();

        Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder.queryParam("query", address).build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        var result = (List<Map<String,Object>>) response.get("addresses");

        var finalResult = result.get(0);
        double latitude = Double.parseDouble((String) finalResult.get("y"));
        double longitude = Double.parseDouble((String) finalResult.get("x"));
        return new StoreAddressDto(latitude, longitude);
    }
}
