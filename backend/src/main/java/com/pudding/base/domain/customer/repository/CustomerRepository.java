package com.pudding.base.domain.customer.repository;

import com.pudding.base.domain.customer.dto.CustomerDto;
import com.pudding.base.domain.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByDid(String did);


    // Customer + Member LEFT JOIN, DTO 바로 반환
    @Query("SELECT new com.pudding.base.domain.customer.dto.CustomerDto(" +
            "c.id, c.did, c.memberId, c.isActive, c.createdAt, " +
            "(SELECT m.name FROM Member m WHERE m.id = c.memberId)) " +
            "FROM Customer c " +
            "WHERE c.id = :customerId")
    Optional<CustomerDto> findCustomerWithMemberNameById(@Param("customerId") Integer customerId);
}
