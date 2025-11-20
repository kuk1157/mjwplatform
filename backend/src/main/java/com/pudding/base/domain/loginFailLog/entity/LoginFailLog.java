package com.pudding.base.domain.loginFailLog.entity;


import com.pudding.base.domain.common.entity.BaseTimeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "login_fail_log") // 로그인 실패 로그
public class LoginFailLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "고유번호")
    private Integer id;

    @Column(name = "error_code")
    @Schema(description = "에러코드")
    private String errorCode;

    @Column(name = "fail_type")
    @Schema(description = "실패 타입")
    private String failType;

    @Column(name = "message")
    @Schema(description = "에러메시지")
    private String message;


    @Builder
    public LoginFailLog(Integer id, String errorCode, String failType, String message){
        this.id = id;
        this.errorCode = errorCode;
        this.failType = failType;
        this.message = message;
    }
}
