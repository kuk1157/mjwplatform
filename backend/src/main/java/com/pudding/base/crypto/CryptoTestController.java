package com.pudding.base.crypto;

import com.pudding.base.crypto.service.FileCrypto;
import com.pudding.base.crypto.util.CryptoEnvelopeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.Map;

/**
 * 봉투형태 단일 파일(.encpkg) 로컬 테스트 컨트롤러
 * - KMS 봉투암호화 + AES-GCM만 검증
 * - 저장/전송은 전부 로컬 파일 시스템
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/crypto-test")
public class CryptoTestController {

    private final FileCrypto fileCrypto; // KMS 봉투암호화 파사드

    @Value("${pudding.crypto.local-dir:D:\\_WebProject\\workspace\\edudid}")
    private String localDir; // 로컬 저장 디렉토리
    @Value("${pudding.crypto.envelope-ext:encpkg}")
    private String envelopeExt; // 봉투 확장자 (기본: encpkg)

    // 1) 샘플 JSON 생성 → 암호화 → 단일 봉투 파일 저장
    @PostMapping("/encrypt-sample")
    public Map<String, Object> encryptSample(
            @RequestParam long docId,
            @RequestParam String ownerId,
            @RequestParam(defaultValue = "test-json") String purpose,
            @RequestParam(defaultValue = "true") boolean keepPlain
    ) throws Exception {
        ensureDir();

        String baseName = base(docId, ownerId, null);
        String json = """
                {
                  "docId": %d,
                  "ownerId": "%s",
                  "title": "DreamBuilder Test",
                  "items": [ {"name":"alpha","qty":2}, {"name":"beta","qty":5} ],
                  "ts": "%s"
                }
                """.formatted(docId, ownerId, Instant.now());

        String aad = fileCrypto.defaultAad(String.valueOf(docId), ownerId, purpose);

        var out = fileCrypto.encryptBytes(json.getBytes(StandardCharsets.UTF_8), aad);

        Path pkgPath = path(baseName + "." + envelopeExt);
        CryptoEnvelopeUtil.write(pkgPath, out.getCiphertext(), out.getMeta());

        // 옵션: 평문도 남겨 검증
        Path plainPath = path(baseName + ".json");
        if (keepPlain) Files.writeString(plainPath, json, StandardCharsets.UTF_8);

        return Map.of(
                "package", pkgPath.toString(),
                "plain", keepPlain ? plainPath.toString() : "(skipped)",
                "aad", aad
        );
    }

    // 2) 업로드한 JSON 파일 → 암호화 → 단일 봉투 파일 저장
    @PostMapping(path = "/encrypt-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> encryptFile(
            @RequestParam long docId,
            @RequestParam String ownerId,
            @RequestParam(defaultValue = "test-json") String purpose,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "true") boolean keepPlain
    ) throws Exception {
        ensureDir();

        String baseName = base(docId, ownerId, stripExt(file.getOriginalFilename()));
        String aad = fileCrypto.defaultAad(String.valueOf(docId), ownerId, purpose);

        var out = fileCrypto.encryptBytes(file.getBytes(), aad);

        Path pkgPath = path(baseName + "." + envelopeExt);
        CryptoEnvelopeUtil.write(pkgPath, out.getCiphertext(), out.getMeta());

        Path plainPath = path(baseName + ".json");
        if (keepPlain) Files.write(plainPath, file.getBytes());

        return Map.of(
                "package", pkgPath.toString(),
                "plain", keepPlain ? plainPath.toString() : "(skipped)",
                "aad", aad
        );
    }

    // 3) 봉투 파일 1개만으로 복호화 → JSON 반환
    @GetMapping("/decrypt")
    public ResponseEntity<byte[]> decrypt(
            @RequestParam long docId,
            @RequestParam String ownerId,
            @RequestParam(required = false) String name, // encrypt-file 때 원본 파일명(옵션)
            @RequestParam(defaultValue = "test-json") String purpose,
            @RequestParam(defaultValue = "true") boolean inline
    ) throws Exception {
        ensureDir();

        String baseName = base(docId, ownerId, name);
        Path pkgPath = path(baseName + "." + envelopeExt);

        var read = CryptoEnvelopeUtil.read(pkgPath);        // 봉투 → (cipher, meta)
        var meta = read.meta();

        // 같은 KeyTag 내 최신버전 재래핑(lazy) → 바뀌면 봉투 헤더만 갱신
        if (fileCrypto.rewrapIfNeeded(meta)) {
            CryptoEnvelopeUtil.write(pkgPath, read.ciphertext(), meta);
        }

        byte[] plain = fileCrypto.decryptBytes(read.ciphertext(), meta);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        var cd = ContentDisposition.builder(inline ? "inline" : "attachment")
                .filename(docId + ".json", StandardCharsets.UTF_8).build();
        headers.setContentDisposition(cd);

        return ResponseEntity.ok().headers(headers).body(plain);
    }

    // --- helpers ---
    private void ensureDir() throws Exception {
        Files.createDirectories(Path.of(localDir));
    }

    private Path path(String name) {
        return Path.of(localDir, name);
    }

    private String base(long docId, String ownerId, String preferred) {
        String base = (StringUtils.hasText(preferred) ? preferred : (docId + "-" + ownerId));
        return base.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String stripExt(String filename) {
        if (!StringUtils.hasText(filename)) return null;
        int i = filename.lastIndexOf('.');
        return i > 0 ? filename.substring(0, i) : filename;
    }
}
