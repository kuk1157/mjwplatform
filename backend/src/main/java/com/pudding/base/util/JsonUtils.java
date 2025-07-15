package com.pudding.base.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class JsonUtils {
    public static List<Integer> parseJsonToIdList(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // JSON 배열을 List<Integer>로 변환
            return objectMapper.readValue(json, new TypeReference<List<Integer>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("삭제할 BookTab ID 목록을 파싱하는 중 오류가 발생했습니다.", e);
        }
    }
}
