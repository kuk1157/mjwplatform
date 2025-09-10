package com.pudding.base.domain.point.controller;

import com.pudding.base.domain.point.dto.PointDto;
import com.pudding.base.domain.point.service.PointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Pageable;

@Tag(name = "포인트 관련 api", description = "포인트 관련 전체 api")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/point")
public class PointController {

    private final PointService pointService;

    @Operation(summary = "포인트 전체 조회", description = "포인트 전체 조회 api")
    @GetMapping
    public ResponseEntity<Page<PointDto>> getAllPoint(Pageable pageable){
        Page<PointDto> pointDto = pointService.findAllPoint(pageable);
        return ResponseEntity.ok(pointDto);
    }

    @Operation(summary = "점주 포인트 조회", description = "점주 웹 플랫폼 대시보드 용도")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<Page<PointDto>> getOwnerIdByPoint(@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable, @PathVariable Integer ownerId){
        Page<PointDto> pointDto = pointService.findByOwnerIdPoint(pageable, ownerId);
        return ResponseEntity.ok(pointDto);
    }


}
