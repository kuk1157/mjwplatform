package com.pudding.base.domain.visit.service;

import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.customer.repository.CustomerRepository;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.visit.dto.QrVisitLogDto;
import com.pudding.base.domain.visit.entity.QrVisitLog;
import com.pudding.base.domain.visit.repository.QrVisitLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QrVisitLogServiceImpl implements QrVisitLogService {

    private final QrVisitLogRepository qrVisitLogRepository;
    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;


    public QrVisitLogDto createQrVisitLog(QrVisitLogDto.Request qrVisitLogDto, Integer storeNum, Integer tableNumber){
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

        QrVisitLog qrVisitLog = QrVisitLog.builder()
                .customerId(customer.getId())
                .ownerId(store.getOwnerId())
                .storeId(storeNum)
                .storeTableId(tableNumber)
                .storeName(store.getName())
                .build();
        QrVisitLog savedQrVisit = qrVisitLogRepository.save(qrVisitLog);
        return QrVisitLogDto.fromEntity(savedQrVisit);

    }
}
