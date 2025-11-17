package com.pudding.base.domain.nft.repository;

import com.pudding.base.domain.nft.dto.NftDto;
import com.pudding.base.domain.nft.entity.Nft;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NftRepository extends JpaRepository<Nft, Integer> {
    Page<Nft> findByCustomerId(Integer customerId, Pageable pageable);
    List<Nft> findByCustomerId(Integer customerId, Sort sort);
    boolean existsByStoreIdAndCustomerId(Integer storeId, Integer customerId);

    @Query("""
    SELECT new com.pudding.base.domain.nft.dto.NftDto(
        n.id,
        n.tokenId,
        n.storeId,
        n.customerId,
        n.nftIdx,
        n.storeTableId,
        s.name,
        s.nftImage,
        s.thumbnail,
        s.extension,
        n.createdAt
    )
    FROM Nft n
    LEFT JOIN Store s ON n.storeId = s.id
    WHERE n.id = :id
""")
    NftDto findNftById(@Param("id") Integer id);


}
