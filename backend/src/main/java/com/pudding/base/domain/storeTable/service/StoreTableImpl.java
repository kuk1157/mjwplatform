package com.pudding.base.domain.storeTable.service;

import com.pudding.base.domain.storeTable.dto.StoreTableDto;
import com.pudding.base.domain.storeTable.entity.StoreTable;
import com.pudding.base.domain.storeTable.repository.StoreTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreTableImpl implements StoreTableService {

    private final StoreTableRepository storeTableRepository;

    @Override
    public List<StoreTableDto> getTablesByStoreNum(Integer storeNum) {
        List<StoreTable> storeTables = storeTableRepository.findByStoreId(storeNum);

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

}
