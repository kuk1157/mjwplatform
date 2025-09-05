package com.pudding.base.crypto.entity;

import lombok.*;
import jakarta.persistence.*;

import java.time.Instant;

/**
 * enc_meta 테이블 매핑
 */
@Entity
@Table(name = "enc_meta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncMetaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 64, nullable = false)
    private String cipherSha256;

    @Column(length = 32, nullable = false)
    @Builder.Default
    private String algo = "AES-256-GCM";

    @Column(length = 24, nullable = false)
    private String ivB64;

    @Column(nullable = false)
    @Builder.Default
    private Integer tagBits = 128;

    @Lob
    @Column(nullable = false)
    private String wrappedDek;

    @Column(length = 64, nullable = false)
    private String aadHash;        // AAD 원문 대신 해시

    @Column(nullable = false)
    private Instant createdAt;     // 앱에서 세팅 (AAD 구성 요소)

    @Column(nullable = false)
    private Instant wrappedAt;     // rewrap 시 갱신
}
