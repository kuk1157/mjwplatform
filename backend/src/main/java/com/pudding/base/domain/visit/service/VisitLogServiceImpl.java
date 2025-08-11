package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.common.enums.IsComplete;
import com.pudding.base.domain.common.enums.IsPaymentStatus;
import com.pudding.base.domain.common.enums.IsVisitStatus;
import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.member.entity.Member;
import com.pudding.base.domain.member.enums.Role;
import com.pudding.base.domain.member.repository.MemberRepository;
import com.pudding.base.domain.nft.service.NftService;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeTable.dto.StoreTableDto;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.entity.VisitLog;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitLogServiceImpl implements VisitLogService {

    private final VisitLogRepository visitLogRepository;
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final MemberRepository memberRepository;
    private final NftService nftService;

    @Transactional
    public VisitLogDto createVisitLog(String did, Integer storeNum, Integer tableNumber){
        Customer customer = customerRepository.findByDid(did).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 고객입니다."));
        Store store = storeRepository.findById(storeNum).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장입니다."));

        VisitLog visitLog = VisitLog.builder()
                .customerId(customer.getId())
                .ownerId(store.getOwnerId())
                .storeId(storeNum)
                .storeTableId(tableNumber)
                .storeName(store.getName())
                .build();
        VisitLog savedQrVisit = visitLogRepository.save(visitLog);

        // Socket 서버로 전송
        sendToSocketServer(savedQrVisit);

        // nft 발급 중복 체크
        boolean nftExists = nftService.nftExists(storeNum, customer.getId());
        if(!nftExists){
            // nft 발급 진행
            nftService.createNft(customer.getDid(), storeNum, customer.getId());
        }

        return VisitLogDto.fromEntity(savedQrVisit);
    }

    private void sendToSocketServer(VisitLog visitLog) {
        String socketServerUrl = "http://localhost:4000/api/socket/store-visitLogs";
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("visitLog", visitLog);
            payload.put("storeId", visitLog.getStoreId());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(socketServerUrl, request, String.class);
        } catch (Exception e) {
            log.error("소켓 서버 통신 실패", e);
        }
    }

    public List<VisitLogDto> getAllVisitLogSorted(Integer customerId, String sort) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, "createdAt");

        List<VisitLog> visitLogs = visitLogRepository.findByCustomerId(customerId, sortObj);

        return visitLogs.stream()
                .map(visitLog -> VisitLogDto.builder()
                        .id(visitLog.getId())
                        .ownerId(visitLog.getOwnerId())
                        .storeId(visitLog.getStoreId())
                        .storeTableId(visitLog.getStoreTableId())
                        .customerId(visitLog.getCustomerId())
                        .storeName(visitLog.getStoreName())
                        .createdAt(visitLog.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<VisitLogDto> getLimitedVisitLogSorted(Integer customerId, String sort, Integer limit) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sortObj = Sort.by(direction, "createdAt");

        Pageable pageable = PageRequest.of(0, limit, sortObj);
        List<VisitLog> visitLogs = visitLogRepository.findByCustomerId(customerId, pageable).getContent();

        return visitLogs.stream()
                .map(visitLog -> VisitLogDto.builder()
                        .id(visitLog.getId())
                        .ownerId(visitLog.getOwnerId())
                        .storeId(visitLog.getStoreId())
                        .storeTableId(visitLog.getStoreTableId())
                        .customerId(visitLog.getCustomerId())
                        .storeName(visitLog.getStoreName())
                        .createdAt(visitLog.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }



    public List<VisitLogDto> getAllVisitLog(Integer storeNum){
        List<VisitLog> visitLogs = visitLogRepository.findByStoreId(storeNum);
        // StoreTable 엔티티를 StoreTableDto로 변환
        return visitLogs.stream()
                .map(visitLog -> VisitLogDto.builder()
                        .id(visitLog.getId())
                        .ownerId(visitLog.getOwnerId())
                        .storeId(visitLog.getStoreId())
                        .storeTableId(visitLog.getStoreTableId())
                        .customerId(visitLog.getCustomerId())
                        .storeName(visitLog.getStoreName())
                        .createdAt(visitLog.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<VisitLogDto> getStoreByAndVisitStatusAndPaymentStatusByVisitLog(Integer storeNum, IsPaymentStatus paymentStatus, IsVisitStatus visitStatus){
        List<VisitLog> visitLogs = visitLogRepository.findByStoreIdAndPaymentStatusAndVisitStatus(storeNum, IsPaymentStatus.n, IsVisitStatus.n);
        // StoreTable 엔티티를 StoreTableDto로 변환
        return visitLogs.stream()
                .map(visitLog -> VisitLogDto.builder()
                        .id(visitLog.getId())
                        .ownerId(visitLog.getOwnerId())
                        .storeId(visitLog.getStoreId())
                        .storeTableId(visitLog.getStoreTableId())
                        .customerId(visitLog.getCustomerId())
                        .storeName(visitLog.getStoreName())
                        .createdAt(visitLog.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

}
