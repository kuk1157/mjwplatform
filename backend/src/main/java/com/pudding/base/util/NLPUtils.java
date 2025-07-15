package com.pudding.base.util;

import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class NLPUtils {

    public static List<String> extractWords(String sentence) {
        // 띄어쓰기를 기준으로 분리
        String[] words = sentence.split("\\s+"); // 정규식을 사용하여 공백 기준으로 분리
        List<String> result = new ArrayList<>();

        // 길이가 2 이상인 단어만 추가
        for (String word : words) {
            if (word.length() > 1) {
                result.add(word);
            }
        }

        return result;
    }

    public static List<String> extractNouns(String sentence) {
        List<String> nouns = new ArrayList<>();

        try {
            // 토크나이저 모델 로드
            InputStream tokenModelIn = NLPUtils.class.getResourceAsStream("/en-token.bin");
            TokenizerModel tokenModel = new TokenizerModel(tokenModelIn);
            Tokenizer tokenizer = new TokenizerME(tokenModel);

            // 품사 태거 모델 로드
            InputStream posModelIn = NLPUtils.class.getResourceAsStream("/en-pos-maxent.bin");
            POSModel posModel = new POSModel(posModelIn);
            POSTaggerME posTagger = new POSTaggerME(posModel);

            // 토큰화
            String[] tokens = tokenizer.tokenize(sentence);

            // 품사 태깅
            String[] tags = posTagger.tag(tokens);

            // 명사 추출
            for (int i = 0; i < tags.length; i++) {
                if (tags[i].startsWith("NN")) { // NN으로 시작하는 태그는 명사
                    nouns.add(tokens[i]);
                }
            }
        } catch (Exception e) {
            System.err.println("Error occurred while extracting nouns: " + e.getMessage());
        }

        return nouns;
    }
}