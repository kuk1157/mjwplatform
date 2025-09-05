package com.pudding.base.crypto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pudding.base.crypto.entity.EncMetaEntity;
import com.pudding.base.crypto.repository.EncMetaRepository;
import com.pudding.base.crypto.service.EncMetaManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/crypto-test")
public class CryptoTestController {

    private final EncMetaManager manager;
    private final EncMetaRepository repo;
    private final ObjectMapper om = new ObjectMapper().findAndRegisterModules();

    /** 1) JSON 본문 암호화 → EncMetaManager가 DB 저장까지 수행 → 결과 리턴 */
    @PostMapping(path="/encrypt-json", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> encryptJson(
            @RequestBody Map<String,Object> json,
            @RequestParam(defaultValue="false") boolean includeEnc,
            @RequestParam(defaultValue="false") boolean download
    ) throws Exception {
        byte[] plain = om.writeValueAsBytes(json);
        var res = manager.encryptBytes(plain); // DB 저장

        if (download) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment()
                                .filename(res.getId() + ".enc", StandardCharsets.UTF_8).toString())
                    .body(res.getCipher());
        }

        return ResponseEntity.ok(Map.of(
                "id", res.getId(),
                "cipher_sha256", res.getCipherSha256(),
                "created_at", res.getCreatedAt().toString(),
                "enc_base64", includeEnc ? Base64.getEncoder().encodeToString(res.getCipher()) : "(omitted)"
        ));
    }

    /** 2) 파일(멀티파트) 암호화 → EncMetaManager(DB 저장 포함) */
    @PostMapping(path="/encrypt-file", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> encryptFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue="false") boolean includeEnc,
            @RequestParam(defaultValue="false") boolean download
    ) throws Exception {
        var res = manager.encryptBytes(file.getBytes()); // 파사드 호출(메타 저장 포함)

        if (download) {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment()
                                .filename(res.getId() + ".enc", StandardCharsets.UTF_8).toString())
                    .body(res.getCipher());
        }

        return ResponseEntity.ok(Map.of(
                "id", res.getId(),
                "cipher_sha256", res.getCipherSha256(),
                "created_at", res.getCreatedAt().toString(),
                "enc_base64", includeEnc ? Base64.getEncoder().encodeToString(res.getCipher()) : "(omitted)"
        ));
    }

    /** 3) 복호화: id + enc 바이트 → EncMetaManager가 검증/회전/복호화 수행 */
    @PostMapping(path="/decrypt", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> decrypt(
            @RequestParam int id,
            @RequestParam("enc") MultipartFile enc,
            @RequestParam(defaultValue="true") boolean json
    ) throws Exception {
        byte[] plain = manager.decryptBytes(id, enc.getBytes()); // 파사드 호출
        return ResponseEntity.ok()
                .contentType(json ? MediaType.APPLICATION_JSON : MediaType.APPLICATION_OCTET_STREAM)
                .body(plain);
    }

    /** 4) 메타 요약 조회(민감값 제외) */
    @GetMapping("/meta/{id}")
    public ResponseEntity<Map<String,Object>> meta(@PathVariable int id) {
        EncMetaEntity m = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("meta not found: id=" + id));
        return ResponseEntity.ok(Map.of(
                "id", m.getId(),
                "cipher_sha256", m.getCipherSha256(),
                "algo", m.getAlgo(),
                "tag_bits", m.getTagBits(),
                "created_at", m.getCreatedAt().toString(),
                "wrapped_at", m.getWrappedAt().toString()
        ));
    }
}
