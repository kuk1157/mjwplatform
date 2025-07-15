package com.pudding.base.file;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class FileInfoListConverter implements AttributeConverter<List<FileInfo>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<FileInfo> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "[]"; // null 또는 빈 리스트인 경우 빈 JSON 배열 반환
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert FileInfo list to JSON", e);
        }
    }

    @Override
    public List<FileInfo> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return new ArrayList<>(); // null 또는 빈 문자열인 경우 빈 리스트 반환
        }
        try {
            return objectMapper.readValue(dbData, objectMapper.getTypeFactory().constructCollectionType(List.class, FileInfo.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to FileInfo list", e);
        }
    }
}
