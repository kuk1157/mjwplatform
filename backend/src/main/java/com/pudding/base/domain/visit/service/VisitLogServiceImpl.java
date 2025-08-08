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
        Customer customer = customerRepository.findByDid(did).orElse(null);
        Member member = memberRepository.findByDid(did).orElse(null);
        Store store = storeRepository.findById(storeNum).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장입니다."));

        // member, customer 둘다 없을 경우
        if (customer == null || member == null) {
            if (member == null) {
                // 모바일 로그인 계정 추가
                member = memberRepository.save(
                        Member.builder()
                                .did(did)
                                .loginId(did) // 아이디 임의로 did로 주기(점주용 웹에서 로그인안됨 어차피)
                                .password("1234") // 임시로 1234
                                .name("임시이름") // 임시로 "임시이름"
                                .birthday(LocalDate.from(LocalDateTime.now()))
                                .role(Role.user)
                                .build()
                );
            }
            if (customer == null) {
                // 고객 정보 남길 customer 추가 (생성된 memberId 남김)
                customer = customerRepository.save(
                        Customer.builder()
                                .did(did)
                                .memberId(member.getId())
                                .build()
                );
            }
        }

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
