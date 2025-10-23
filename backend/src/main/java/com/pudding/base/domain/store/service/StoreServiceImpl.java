package com.pudding.base.domain.store.service;

import com.pudding.base.domain.common.exception.CustomException;
import com.pudding.base.domain.member.dto.MemberDto;
import com.pudding.base.domain.store.dto.StoreAddressDto;
import com.pudding.base.domain.store.dto.StoreDto;
import com.pudding.base.domain.store.dto.StoreRequestDto;
import com.pudding.base.domain.store.dto.StoreUpdateDto;
import com.pudding.base.domain.store.entity.Store;
import com.pudding.base.domain.store.repository.StoreRepository;
import com.pudding.base.file.s3.S3Service;
import com.pudding.base.naver.api.NaverGecode;
import com.pudding.base.util.FileUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService{

    private final NaverGecode naverGecode;
    private final StoreRepository storeRepository;
    private final S3Service s3Service;
    String folderName = "coex/store";

    // 매장 등록
    public StoreDto createStore(StoreRequestDto storeRequestDto, MultipartFile file){
        // 매장 이미 보유하고 있는 점주 예외처리
        boolean exists = storeRepository.existsByOwnerId(storeRequestDto.getOwnerId());
        if (exists) {
            throw new CustomException("선택한 점주는 이미 매장을 보유하고 있습니다.");
        }

        // 위도 경도 추출
        StoreAddressDto storeAddressDto = naverGecode.geocodeAddress(storeRequestDto.getAddress());

        Store store = Store.builder()
                .ownerId(storeRequestDto.getOwnerId())
                .name(storeRequestDto.getName())
                .address(storeRequestDto.getAddress())
                .latitude(storeAddressDto.getLatitude()) // 위도 저장
                .longitude(storeAddressDto.getLongitude()) // 경도 저장
                .build();
        try {
            // 썸네일 첨부
            if (file != null && !file.isEmpty()) {
                String fileUuid = UUID.randomUUID().toString();
                String extension = FileUtils.getFileExtension(file.getOriginalFilename());

                // DB에 썸네일, 확장자 저장
                store.updateThumbnail(fileUuid);
                store.updateExtension("." + extension);

                String objectName = folderName + "/" + fileUuid + "." + extension;
                s3Service.uploadFile(objectName, file);
            }

        } catch (Exception e) {
            throw new RuntimeException("썸네일 업로드 실패", e);
        }

        Store savedStore = storeRepository.save(store);
        return StoreDto.fromEntity(savedStore);
    }

    public StoreDto updateStore(StoreUpdateDto storeUpdateDto, Integer id, MultipartFile file){
        Store store = storeRepository.findById(id).orElseThrow(() -> new CustomException("존재하지 않는 매장 입니다."));
        // 매장 수정시 매장 이름 중복체크
        boolean exists = storeRepository.existsByNameAndIdNot(storeUpdateDto.getName(), id);
        if (exists) {
            throw new CustomException("동일한 이름의 매장이 존재합니다. 다른 이름을 입력해주세요.");
        }

        System.out.println("-----------1번---------");
        System.out.println(storeUpdateDto.getName());
        System.out.println(storeUpdateDto.getAddress());

        try {
            // 썸네일 첨부
            if (file != null && !file.isEmpty()) {
                String fileUuid = UUID.randomUUID().toString();
                String extension = FileUtils.getFileExtension(file.getOriginalFilename());

                // DB에 썸네일, 확장자 저장
                store.updateThumbnail(fileUuid);
                store.updateExtension("." + extension);

                String objectName = folderName + "/" + fileUuid + "." + extension;
                s3Service.uploadFile(objectName, file);
            }

        } catch (Exception e) {
            throw new RuntimeException("썸네일 업로드 실패", e);
        }

        // 위도 경도 추출
        StoreAddressDto storeAddressDto = naverGecode.geocodeAddress(storeUpdateDto.getAddress());
        // 위도 경도까지 함께 update
        store.updateStoreInfo(storeUpdateDto.getName(), storeUpdateDto.getAddress(),storeAddressDto.getLatitude(), storeAddressDto.getLongitude());

//        // 위도 경도까지 함께 update
//        store.updateStoreInfo(storeUpdateDto.getName(), storeUpdateDto.getAddress());

        System.out.println("-----------2번---------");
        System.out.println(storeUpdateDto.getName());
        System.out.println(storeUpdateDto.getAddress());

        storeRepository.save(store);
        return StoreDto.fromEntity(store);
    }

    // 매장 전체 조회
    public Page<StoreDto> getAllStore(Pageable pageable, String keyword){
        return storeRepository.findByStoreSearch(pageable, keyword);
    }

    // 매장 상세 조회
    public StoreDto findStoreById(Integer id){
        return storeRepository.findByStoreIdSearch(id);
    }

    // 매장 상세 조회 - 메인 대시보드 용도
    public StoreDto findStoreByOwnerId(Integer ownerId){
        return storeRepository.findByOwnerIdSearch(ownerId);
    }

    public List<MemberDto> getAvailableOwners(){
        return storeRepository.findAvailableOwners();
    }
}
