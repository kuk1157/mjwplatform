package com.pudding.base.dchain;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public class MyOwnerKeyProvider implements DaeguChainClient.OwnerKeyProvider {

    @Value("${daeguchain.privateKey}")
    private String ownerPrivateKey;

    @Override
    public String getOwnerPrivateKeyFor(String contractAddress) {
        return ownerPrivateKey; // 테스트용, 단순 반환
    }
}
