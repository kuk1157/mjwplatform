package com.pudding.base.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient daeguWebClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .compress(true)                                   // 응답 압축
                .responseTimeout(Duration.ofSeconds(30))          // 전체 응답 타임아웃
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(30))   // 소켓 read 타임아웃
                        .addHandlerLast(new WriteTimeoutHandler(30))); // 소켓 write 타임아웃

        return builder
                .baseUrl("https://www.daegu.go.kr/daeguchain")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                // 민감정보 바디 로깅 금지(엔드포인트 필터 예시)
                .filter(redactBodyFor())
                .build();
    }

    // 엔드포인트별 바디 로깅 차단용 필터(필요 시 커스터마이즈)
    private ExchangeFilterFunction redactBodyFor() {
        return (request, next) -> {
            if (request.url().getPath().startsWith("/v2/mitum/com/acc_create")) {
                // 여기서 바디 로깅을 하지 않도록 처리 (별도 로거 연동 시 활용)
            }
            return next.exchange(request);
        };
    }
}
