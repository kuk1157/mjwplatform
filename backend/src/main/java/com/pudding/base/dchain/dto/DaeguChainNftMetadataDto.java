package com.pudding.base.dchain.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DaeguChainNftMetadataDto {
    private String schema_id;
    private String type;
    private String name;
    private String description;
    private Issuer issuer;
    private Holder holder;
    private Visit visit;
    private Image image;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Issuer {
        private String store_id;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Holder {
        private String wallet;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Visit {
        private String table_id;
        private String checkIn_time; // yyyy-MM-dd HH:mm:ss
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Image {
        private String uri;
        private String hash;
    }
}
