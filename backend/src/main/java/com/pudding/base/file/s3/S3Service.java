package com.pudding.base.file.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.pudding.base.util.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${nc.s3.bucket-name}")
    private String bucketName;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }


    // 경로 보안 용도 - presigned url 사용(썸네일 이미지 미리보기, 이미지 다운로드)
    public String generatePresignedUrl(String objectName, int expirationInSeconds) {
        java.util.Date expiration = new java.util.Date(System.currentTimeMillis() + expirationInSeconds * 1000);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, objectName)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);

        return amazonS3.generatePresignedUrl(generatePresignedUrlRequest).toString();
    }

    // MultipartFile 기반 파일업로드 1개버전
    public void uploadFile(String objectName, MultipartFile multipartFile) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            metadata.setContentType(multipartFile.getContentType());

            amazonS3.putObject(bucketName, objectName, multipartFile.getInputStream(), metadata);

            // 업로드 후 퍼블릭 읽기 권한 부여
            amazonS3.setObjectAcl(bucketName, objectName, CannedAccessControlList.PublicRead);
            System.out.println("파일 업로드 및 퍼블릭 권한 설정 완료: " + objectName);

        } catch (IOException e) {
            throw new RuntimeException("S3 파일 업로드 실패", e);
        }
    }



    // 1. 폴더 생성
    public void createFolder(String folderName) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(0);
        metadata.setContentType("application/x-directory");

        PutObjectRequest request = new PutObjectRequest(bucketName, folderName + "/", new ByteArrayInputStream(new byte[0]), metadata);
        amazonS3.putObject(request);

        System.out.println("Folder created: " + folderName);
    }

    // 2. 파일 업로드
    public void uploadFile(String objectName, File file) {
        amazonS3.putObject(bucketName, objectName, file);
        System.out.println("File uploaded: " + objectName);
    }

    // 3. 파일 목록 조회
    public List<String> listFiles() {
        ListObjectsRequest request = new ListObjectsRequest().withBucketName(bucketName);
        ObjectListing listing = amazonS3.listObjects(request);

        List<String> fileNames = new ArrayList<>();
        for (S3ObjectSummary summary : listing.getObjectSummaries()) {
            fileNames.add(summary.getKey());
        }

        return fileNames;
    }

//    // 4. Download File
//    public void downloadFile(String objectName, String destinationPath) {
//        try (S3Object s3Object = amazonS3.getObject(bucketName, objectName);
//             S3ObjectInputStream inputStream = s3Object.getObjectContent();
//             OutputStream outputStream = new FileOutputStream(destinationPath)) {
//
//            byte[] buffer = new byte[4096];
//            int bytesRead;
//            while ((bytesRead = inputStream.read(buffer)) != -1) {
//                outputStream.write(buffer, 0, bytesRead);
//            }
//
//            System.out.println("File downloaded: " + objectName);
//        } catch (IOException e) {
//            throw new RuntimeException("Error downloading file: " + objectName, e);
//        }
//    }

    // 5. 파일 삭제
    public void deleteFile(String objectName) {
        amazonS3.deleteObject(bucketName, objectName);
        System.out.println("File deleted: " + objectName);
    }

    // 6. ACL(파일 읽기 쓰기 등 접근 권한) 설정
    public void setObjectAcl(String objectName, CannedAccessControlList acl) {
        amazonS3.setObjectAcl(bucketName, objectName, acl);
        System.out.println("ACL set for object: " + objectName);
    }

    // 7. 멀티파트 업로드
    public void multipartUpload(String objectName, MultipartFile file) {
        File tempFile = null;
        try {
            tempFile = FileUtils.convertMultipartFileToFile(file);
            long contentLength = tempFile.length();
            long partSize = 1000 * 1024 * 1024; // 1000 MB

            InitiateMultipartUploadRequest initRequest = new InitiateMultipartUploadRequest(bucketName, objectName);
            InitiateMultipartUploadResult initResponse = amazonS3.initiateMultipartUpload(initRequest);

            List<PartETag> partETags = new ArrayList<>();
            long fileOffset = 0;

            for (int i = 1; fileOffset < contentLength; i++) {
                long currentPartSize = Math.min(partSize, contentLength - fileOffset);

                UploadPartRequest uploadRequest = new UploadPartRequest()
                        .withBucketName(bucketName)
                        .withKey(objectName)
                        .withUploadId(initResponse.getUploadId())
                        .withFile(tempFile)
                        .withFileOffset(fileOffset)
                        .withPartSize(currentPartSize)
                        .withPartNumber(i);

                partETags.add(amazonS3.uploadPart(uploadRequest).getPartETag());
                fileOffset += currentPartSize;
            }

            CompleteMultipartUploadRequest completeRequest = new CompleteMultipartUploadRequest(
                    bucketName, objectName, initResponse.getUploadId(), partETags);
            amazonS3.completeMultipartUpload(completeRequest);

            // 모든 사용자 읽기 쓰기 권한
            setObjectAcl(objectName, CannedAccessControlList.PublicReadWrite);
            System.out.println("ACL set for object: " + objectName);


            System.out.println("Multipart upload completed: " + objectName);
        } catch (Exception e) {
            throw new RuntimeException("Error during multipart upload: " + objectName, e);
        }finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete(); // 로컬 임시 파일 삭제
            }
        }
    }
}
