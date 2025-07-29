package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.visit.dto.VisitLogDto;
import com.pudding.base.domain.visit.entity.VisitLog;
import com.pudding.base.domain.visit.repository.VisitLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VisitLogServiceImpl implements VisitLogService {

    private final VisitLogRepository visitLogRepository;
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;


    public VisitLogDto createQrVisitLog(VisitLogDto.Request qrVisitLogDto, Integer storeNum, Integer tableNumber){
        Customer customer = customerRepository.findByDid(qrVisitLogDto.getDid())
                .orElse(null);

        Store store = storeRepository.findById(storeNum).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장입니다."));


        if (customer == null) {
            // 신규 고객 등록
            Customer newCustomer = Customer.builder()
                    .did(qrVisitLogDto.getDid())
                    .name("테스트트트트") // 테스트용 임시 이름
                    .build();
            customer = customerRepository.save(newCustomer);
        }

        VisitLog visitLog = VisitLog.builder()
                .customerId(customer.getId())
                .ownerId(store.getOwnerId())
                .storeId(storeNum)
                .storeTableId(tableNumber)
                .storeName(store.getName())
                .build();
        VisitLog savedQrVisit = visitLogRepository.save(visitLog);
        return VisitLogDto.fromEntity(savedQrVisit);

    }
}
