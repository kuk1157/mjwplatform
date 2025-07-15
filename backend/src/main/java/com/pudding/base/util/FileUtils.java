package com.pudding.base.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URL;

public class FileUtils {

    /**
     * 파일 이름에서 확장자를 추출합니다.
     * @param fileName 파일 이름
     * @return 확장자 (확장자가 없는 경우 빈 문자열 반환)
     */
    public static String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return ""; // 확장자가 없거나 파일 이름이 .으로 끝나는 경우
        }

        return fileName.substring(lastDotIndex + 1);
    }

    /**
     * MultipartFile을 File로 변환
     * @param file file
     * @return 변환된 File
     * @throws IOException 변환 중 오류 발생
     */
    public static File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File tempFile = new File(System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename());
        file.transferTo(tempFile);
        return tempFile;
    }

    /**
     * URL에서 파일 다운로드
     * @param fileUrl 다운로드할 파일의 URL
     * @return 임시로 저장된 File 객체
     * @throws IOException 다운로드 또는 파일 생성 중 오류 발생
     */
    public static File downloadFileFromUrl(String fileUrl) throws IOException {
        URL url = new URL(fileUrl);

        // 임시 파일 생성
        String tempFileName = "temp_" + System.currentTimeMillis();
        File tempFile = File.createTempFile(tempFileName, null);

        try (InputStream inputStream = url.openStream();
             OutputStream outputStream = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        }

        return tempFile;
    }

    public static String determineFileType(String contentType) {
        if (contentType != null) {
            if (contentType.startsWith("image")) {
                return "image";
            } else if (contentType.startsWith("video")) {
                return "video";
            }
        }
        return "unknown";
    }
}
