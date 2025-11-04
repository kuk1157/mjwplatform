package com.pudding.base.domain.storeTable.service;

import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.domain.storeTable.dto.StoreTableDto;
import com.pudding.base.domain.storeTable.entity.StoreTable;
import com.pudding.base.domain.storeTable.repository.StoreTableRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreTableServiceImpl implements StoreTableService {

    private final StoreTableRepository storeTableRepository;
    private final StoreRepository storeRepository;

    @Transactional
    @Override
    public StoreTableDto createStoreTable(Integer storeId){
        Store store = findByStoreEntity(storeId);

        // repository 에서 max, 그리고 store_id 기준으로 해당 가맹점의 마지막 테이블번호 추출하고 +1
        Integer storeTableNumber = storeTableRepository.findTableNumberByStoreId(storeId);
        if (storeTableNumber == null) {
            storeTableNumber = 1; // 첫 테이블이라면 1번으로 시작
        }

        StoreTable storeTable = StoreTable.builder()
                .storeId(storeId)
                .tableNumber(storeTableNumber)
                .build();
        StoreTable saved = storeTableRepository.save(storeTable);

        return StoreTableDto.builder()
                .id(saved.getId())
                .storeId(saved.getStoreId())
                .tableNumber(saved.getTableNumber())
                .createdAt(saved.getCreatedAt())
                .build();
    }



    @Override
    public List<StoreTableDto> getTablesByStoreId(Integer storeId) {
        List<StoreTable> storeTables = storeTableRepository.findByStoreId(storeId);

        // StoreTable 엔티티를 StoreTableDto로 변환
        return storeTables.stream()
                .map(storeTable -> StoreTableDto.builder()
                        .id(storeTable.getId())
                        .storeId(storeTable.getStoreId())
                        .tableNumber(storeTable.getTableNumber())
                        .createdAt(storeTable.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public Store findByStoreEntity(Integer storeId){
        return storeRepository.findById(storeId).orElseThrow(() -> new EntityNotFoundException("존재하지 않는 매장 입니다."));
    }


}
