package com.pudding.base.domain.customer.repository;

import com.pudding.base.domain.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByDid(String did);

    // 신규 가입자 수 세팅
    @Query(value = """
        SELECT 
            s.name AS storeName, 
            COUNT(c.store_id) AS newCustomerCount
        FROM store s
        LEFT JOIN customer c ON s.id = c.store_id
        GROUP BY s.name
        """, nativeQuery = true)
    List<Map<String, Object>> findNewCustomersByStore();

}
