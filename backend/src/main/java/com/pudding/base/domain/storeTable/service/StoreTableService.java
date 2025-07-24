package com.pudding.base.domain.storeTable.service;
import com.pudding.base.domain.storeTable.dto.StoreTableDto;
import java.util.List;

public interface StoreTableService {
    List<StoreTableDto> getTablesByStoreId(Integer storeId);
    StoreTableDto createStoreTable(Integer storeId);
}
