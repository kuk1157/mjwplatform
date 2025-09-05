package com.pudding.base.crypto.model;

import lombok.*;

import java.time.Instant;

/**
 * 런타임 봉투 메타(AES-GCM 헤더 + KMS 랩핑키)
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvelopeMeta {
    @Builder.Default
    private String algo = "AES-256-GCM";
    private String ivB64;                 // 12B IV(base64)
    @Builder.Default
    private int tagBits = 128;
    private String wrappedDek;            // ncpkms:v1|v2:... 그대로 저장
    private String aad;                   // AAD 문자열 (objectKey+owner+purpose 등)
    //private String keyTag;                // kms.key-tag 기록(감사용)
    @Builder.Default
    private Instant createdAt = Instant.now();
    @Builder.Default
    private Instant wrappedAt = Instant.now();
}