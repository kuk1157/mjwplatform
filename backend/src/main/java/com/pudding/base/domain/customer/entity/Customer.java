package com.pudding.base.domain.customer.entity;
import com.pudding.base.domain.common.enums.CouponAvailable;
import com.pudding.base.domain.common.enums.CouponStatus;
import com.pudding.base.domain.common.enums.CustomerGrade;
import com.pudding.base.domain.common.enums.IsActive;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import java.time.LocalDateTime;


@DynamicInsert
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="customer") // 고객 테이블
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "did")
    @Schema(description = "did")
    private String did;

    @Column(name = "member_id")
    @Schema(description = "로그인 계정 고유번호")
    private Integer memberId;

    @Column(name = "customer_grade")
    @Enumerated(EnumType.STRING)
    @Schema(description = "고객 등급")
    private CustomerGrade customerGrade;

    @Column(name = "coupon_available")
    @Enumerated(EnumType.STRING)
    @Schema(description = "쿠폰 발급 가능 여부")
    private CouponAvailable couponAvailable;

    @Column(name = "coupon_status")
    @Enumerated(EnumType.STRING)
    @Schema(description = "쿠폰 발급 여부")
    private CouponStatus couponStatus;

    @Column(name = "is_active")
    @Enumerated(EnumType.STRING)
    @Schema(description = "활성화 여부")
    private IsActive isActive;

    @Column(name = "created_at", insertable = false, updatable = false)
    @Schema(description = "생성일")
    private LocalDateTime createdAt;

    @Builder
    public Customer(Integer id, String did, Integer memberId, CustomerGrade customerGrade,CouponAvailable couponAvailable,CouponStatus couponStatus, IsActive isActive, LocalDateTime createdAt){
        this.id = id;
        this.did = did;
        this.memberId = memberId;
        this.customerGrade = customerGrade;
        this.couponAvailable = couponAvailable;
        this.couponStatus = couponStatus;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    // 고객 등급 골드 업그레이드 (스탬프 4개)
    public void updateGradeToGold(){
        this.customerGrade = CustomerGrade.GOLD;
    }

    // 고객 등급 플래티넘 업그레이드 (스탬프 7개)
    public void updateGradeToPlatinum(){
        this.customerGrade = CustomerGrade.PLATINUM;
    }

    // 고객 등급 다이아몬드 업그레이드 (스탬프 10개)
    public void updateGradeToDiamond(){
        this.customerGrade = CustomerGrade.DIAMOND;
    }

    // 쿠폰 발급 가능 여부 체크(가맹점 10군데 되었을때 == 모든 가맹점 다 체크했을때)
    public void updateCouponAvailable(){
        this.couponAvailable = CouponAvailable.Y;
    }

    // 쿠폰 발급 여부 체크 (임의로 버튼 만들어서 쿠폰 발급 진행) - 추후 신청으로 바꾸거나 뭐 그럴 계획
    public void updateCouponStatus(){
        this.couponStatus = CouponStatus.Y;
    }
}
