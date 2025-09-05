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
    @Column(name="id")
    private Integer id;

    @Column(name="cipher_sha256", length = 64, nullable = false)
    private String cipherSha256;

    @Column(name="algo", length = 32, nullable = false)
    @Builder.Default
    private String algo = "AES-256-GCM";

    @Column(name="iv_b64",length = 24, nullable = false)
    private String ivB64;

    @Column(name="tag_bits",nullable = false)
    @Builder.Default
    private Integer tagBits = 128;

    @Lob
    @Column(name="wrapped_dek", nullable = false)
    private String wrappedDek;

    @Column(name="aad_hash", length = 64, nullable = false)
    private String aadHash;        // AAD 원문 대신 해시

    @Column(name="created_at", nullable = false)
    private Instant createdAt;     // 앱에서 세팅 (AAD 구성 요소)

    @Column(name="wrapped_at", nullable = false)
    private Instant wrappedAt;     // rewrap 시 갱신
}
