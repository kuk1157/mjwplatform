package com.pudding.base.domain.customer.repository;

import com.pudding.base.domain.customer.entity.Customer;
import com.pudding.base.domain.visit.dto.QrVisitLogDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByDid(String did);
}
