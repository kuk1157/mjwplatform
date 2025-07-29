package com.pudding.base.domain.nft.repository;

import com.pudding.base.domain.nft.entity.Nft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NftRepository extends JpaRepository<Nft, Integer> {
}
