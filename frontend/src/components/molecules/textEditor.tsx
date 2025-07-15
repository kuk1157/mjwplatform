import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "../../utils/tailwindMerge";
import styled from "styled-components";
import { ImageResize } from "quill-image-resize-module-ts";
import HtmlEditButton from "quill-html-edit-button";

// if (typeof window !== "undefined" && window.Quill) {
//     window.Quill = Quill;
// }
Quill.register("modules/ImageResize", ImageResize);
Quill.register("modules/htmlEditButton", HtmlEditButton);
const StyledQuill = styled(ReactQuill)`
    .ql-toolbar {
        background-color: #fff;
        border: 1px solid #d6d6d6;
        border-radius: 5px 5px 0 0;
    }

    .ql-editor {
        font-size: 15px;
        line-height: 1.5;
        height: 322px;
        img {
            max-width: 80%;
        }
    }

    .ql-container {
        border: 1px solid #d6d6d6;
        border-radius: 0 0 5px 5px;
    }
`;

const TextEditor = ({
    content,
    setContent,
    className,
}: {
    content: string | undefined;
    setContent: (content: string) => void;
    className?: string;
}) => {
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }], // 헤더 옵션
                ["bold", "italic", "underline", "strike"], // 텍스트 스타일
                [{ list: "ordered" }, { list: "bullet" }], // 목록
                [{ script: "sub" }, { script: "super" }], // 서브스크립트/슈퍼스크립트
                [{ indent: "-1" }, { indent: "+1" }], // 들여쓰기
                [{ direction: "rtl" }], // 텍스트 방향 (오른쪽에서 왼쪽)
                [{ size: ["small", false, "large", "huge"] }], // 텍스트 크기
                [{ color: [] }, { background: [] }], // 텍스트 색상 및 배경색
                [{ font: [] }], // 글꼴
                [{ align: [] }], // 텍스트 정렬
                ["link", "image", "video"], // 링크, 이미지, 비디오 삽입
                ["clean"], // 서식 초기화
            ],
        },
        htmlEditButton: {
            // 옵션 설정 (선택 사항)
            debug: true, // 콘솔에 로그 출력 (기본값: false)
            msg: "HTML 형식으로 내용을 수정하세요.", // 에디터에 표시될 메시지 (기본값: 'Edit HTML here, when you click "OK" the quill editor\'s contents will be replaced')
            okText: "확인", // 확인 버튼 텍스트 (기본값: 'Ok')
            cancelText: "취소", // 취소 버튼 텍스트 (기본값: 'Cancel')
            buttonHTML: "&lt;", // 툴바 버튼에 표시될 HTML (기본값: '&lt;&gt;')
            buttonTitle: "HTML 소스 보기", // 툴바 버튼에 마우스 오버 시 표시될 툴팁 (기본값: 'Show HTML source')
            syntax: false, // 코드 하이라이팅 사용 여부 (기본값: false)
        },
        ImageResize: {
            modules: ["Resize", "DisplaySize"],
        },
    };

    return (
        <>
            {/* <QuillToolbar /> */}
            <StyledQuill
                onChange={setContent}
                value={content}
                theme="snow"
                modules={modules}
                className={cn("h-[322px]", className)}
                placeholder="내용을 입력하세요."
            />
        </>
    );
};

export { TextEditor };
